terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "dag-terraform-state-af-south-1"
    key            = "production/client/terraform.tfstate"
    region         = "af-south-1"
    dynamodb_table = "dag-terraform-locks"
    encrypt        = true
  }
}

# Main account — all infrastructure (VPC, EC2, ALB, ACM cert)
provider "aws" {
  region = var.region
}

# DNS account — dagindustries.com hosted zone lives here
# Uses a dedicated IAM user with Route53-only permissions in the dag-dubai account
provider "aws" {
  alias      = "dns"
  region     = var.region
  access_key = var.dns_access_key
  secret_key = var.dns_secret_key
}

# ──────────────────────────────────────────────
# Networking — reference existing VPC from server production infra
# The VPC, subnets, NAT Gateway, and IGW are already managed in
# environments/production/terraform.tfstate — no duplication needed.
# ──────────────────────────────────────────────
data "aws_vpc" "main" {
  tags = {
    Name        = "dag-hr-portal-production-vpc"
    Environment = "production"
  }
}

data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }
  tags = {
    Tier = "public"
  }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }
  tags = {
    Tier = "private"
  }
}

# ──────────────────────────────────────────────
# Security Groups
# Defined inline (not via security module) because the security module also
# creates the GitHub OIDC provider, which already exists from the server infra.
# ──────────────────────────────────────────────
resource "aws_security_group" "alb" {
  name        = "${var.project}-${var.environment}-alb-sg"
  description = "Allow HTTPS inbound from internet to ALB"
  vpc_id      = data.aws_vpc.main.id

  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP redirect from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project}-${var.environment}-alb-sg"
    Environment = var.environment
  }
}

resource "aws_security_group" "ec2" {
  name        = "${var.project}-${var.environment}-ec2-sg"
  description = "Allow traffic from ALB only"
  vpc_id      = data.aws_vpc.main.id

  ingress {
    description     = "App port from ALB"
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "All outbound (NAT Gateway handles routing)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project}-${var.environment}-ec2-sg"
    Environment = var.environment
  }
}

# ──────────────────────────────────────────────
# IAM Role: EC2 Instance Profile
# ──────────────────────────────────────────────
resource "aws_iam_role" "ec2_instance_role" {
  name = "${var.project}-${var.environment}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "ec2.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ec2_codedeploy" {
  role       = aws_iam_role.ec2_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforAWSCodeDeploy"
}

resource "aws_iam_role_policy_attachment" "ec2_cloudwatch" {
  role       = aws_iam_role.ec2_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy" "ec2_s3_artifacts" {
  name = "${var.project}-${var.environment}-ec2-s3-artifacts"
  role = aws_iam_role.ec2_instance_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.artifacts_bucket_name}",
          "arn:aws:s3:::${var.artifacts_bucket_name}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project}-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2_instance_role.name
}

# ──────────────────────────────────────────────
# IAM Role: CodeDeploy Service Role
# ──────────────────────────────────────────────
resource "aws_iam_role" "codedeploy" {
  name = "${var.project}-${var.environment}-codedeploy-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "codedeploy.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "codedeploy" {
  role       = aws_iam_role.codedeploy.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
}

# ──────────────────────────────────────────────
# IAM OIDC Provider: GitHub Actions
# The provider already exists in this account (created by server infra).
# Use a data source to reference it — never create a duplicate.
# ──────────────────────────────────────────────
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_role" "github_actions" {
  name = "${var.project}-${var.environment}-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            # Allow pushes to main branch AND workflows using named environments
            "token.actions.githubusercontent.com:sub" = flatten([
              for account in var.github_trusted_accounts : [
                "repo:${account}/*:ref:refs/heads/main",
                "repo:${account}/*:environment:*"
              ]
            ])
          }
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role_policy" "github_actions" {
  name = "${var.project}-${var.environment}-github-actions-policy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # ── S3: deployment artifacts ──────────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject",
          "s3:GetBucketVersioning",
          "s3:PutBucketVersioning",
          "s3:GetBucketPolicy",
          "s3:GetBucketAcl",
          "s3:GetBucketCORS",
          "s3:GetBucketWebsite",
          "s3:GetBucketRequestPayment",
          "s3:GetBucketLogging",
          "s3:GetLifecycleConfiguration",
          "s3:GetReplicationConfiguration",
          "s3:GetEncryptionConfiguration",
          "s3:GetBucketObjectLockConfiguration",
          "s3:GetBucketPublicAccessBlock",
          "s3:PutBucketPublicAccessBlock",
          "s3:PutEncryptionConfiguration",
          "s3:GetBucketTagging",
          "s3:PutBucketTagging",
          "s3:CreateBucket",
          "s3:DeleteBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.artifacts_bucket_name}",
          "arn:aws:s3:::${var.artifacts_bucket_name}/*"
        ]
      },
      # ── S3: Terraform state ───────────────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Resource = [
          "arn:aws:s3:::dag-terraform-state-af-south-1",
          "arn:aws:s3:::dag-terraform-state-af-south-1/*"
        ]
      },
      # ── DynamoDB: Terraform state lock ────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ]
        Resource = "arn:aws:dynamodb:${var.region}:*:table/dag-terraform-locks"
      },
      # ── CodeDeploy: trigger and monitor deployments ───────────────────────
      {
        Effect = "Allow"
        Action = [
          "codedeploy:CreateDeployment",
          "codedeploy:GetDeployment",
          "codedeploy:GetDeploymentConfig",
          "codedeploy:GetDeploymentGroup",
          "codedeploy:GetApplication",
          "codedeploy:GetApplicationRevision",
          "codedeploy:RegisterApplicationRevision",
          "codedeploy:CreateApplication",
          "codedeploy:DeleteApplication",
          "codedeploy:CreateDeploymentGroup",
          "codedeploy:DeleteDeploymentGroup",
          "codedeploy:UpdateDeploymentGroup",
          "codedeploy:ListDeploymentGroups",
          "codedeploy:ListDeployments",
          "codedeploy:ListApplications",
          "codedeploy:ListDeploymentConfigs",
          "codedeploy:ListTagsForResource",
          "codedeploy:TagResource",
          "codedeploy:UntagResource"
        ]
        Resource = "*"
      },
      # ── EC2 / VPC / networking ────────────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "ec2:Describe*",
          "ec2:CreateVpc",
          "ec2:DeleteVpc",
          "ec2:ModifyVpcAttribute",
          "ec2:CreateSubnet",
          "ec2:DeleteSubnet",
          "ec2:ModifySubnetAttribute",
          "ec2:CreateInternetGateway",
          "ec2:DeleteInternetGateway",
          "ec2:AttachInternetGateway",
          "ec2:DetachInternetGateway",
          "ec2:CreateRouteTable",
          "ec2:DeleteRouteTable",
          "ec2:CreateRoute",
          "ec2:DeleteRoute",
          "ec2:AssociateRouteTable",
          "ec2:DisassociateRouteTable",
          "ec2:AllocateAddress",
          "ec2:ReleaseAddress",
          "ec2:CreateNatGateway",
          "ec2:DeleteNatGateway",
          "ec2:CreateSecurityGroup",
          "ec2:DeleteSecurityGroup",
          "ec2:AuthorizeSecurityGroupIngress",
          "ec2:AuthorizeSecurityGroupEgress",
          "ec2:RevokeSecurityGroupIngress",
          "ec2:RevokeSecurityGroupEgress",
          "ec2:CreateLaunchTemplate",
          "ec2:DeleteLaunchTemplate",
          "ec2:ModifyLaunchTemplate",
          "ec2:CreateLaunchTemplateVersion",
          "ec2:DeleteLaunchTemplateVersions",
          "ec2:CreateTags",
          "ec2:DeleteTags"
        ]
        Resource = "*"
      },
      # ── ALB / ELB ─────────────────────────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "elasticloadbalancing:*"
        ]
        Resource = "*"
      },
      # ── Auto Scaling ──────────────────────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "autoscaling:*"
        ]
        Resource = "*"
      },
      # ── IAM ───────────────────────────────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "iam:GetRole",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:UpdateRole",
          "iam:UpdateAssumeRolePolicy",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:GetRolePolicy",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:TagRole",
          "iam:UntagRole",
          "iam:PassRole",
          "iam:GetInstanceProfile",
          "iam:CreateInstanceProfile",
          "iam:DeleteInstanceProfile",
          "iam:AddRoleToInstanceProfile",
          "iam:RemoveRoleFromInstanceProfile",
          "iam:GetOpenIDConnectProvider",
          "iam:ListOpenIDConnectProviders"
        ]
        Resource = "*"
      },
      # ── ACM ───────────────────────────────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "acm:DescribeCertificate",
          "acm:RequestCertificate",
          "acm:DeleteCertificate",
          "acm:ListCertificates",
          "acm:GetCertificate",
          "acm:AddTagsToCertificate",
          "acm:ListTagsForCertificate"
        ]
        Resource = "*"
      },
      # ── CloudWatch / logs ─────────────────────────────────────────────────
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:*",
          "logs:*"
        ]
        Resource = "*"
      }
    ]
  })
}

# ──────────────────────────────────────────────
# DNS: ACM cert (main account) + validation records (dag-dubai)
# jobs.dagindustries.com — zone lives in dag-dubai account
# ──────────────────────────────────────────────
module "dns" {
  source = "../../dag-infrastructure/modules/dns"

  environment = var.environment
  root_domain = var.root_domain
  domain_name = var.domain_name

  providers = {
    aws     = aws
    aws.dns = aws.dns
  }
}

# ──────────────────────────────────────────────
# Compute: ALB + ASG + Launch Template
# ──────────────────────────────────────────────
module "compute" {
  source = "../../dag-infrastructure/modules/compute"

  project                   = var.project
  environment               = var.environment
  region                    = var.region
  vpc_id                    = data.aws_vpc.main.id
  public_subnet_ids         = data.aws_subnets.public.ids
  private_subnet_ids        = data.aws_subnets.private.ids
  alb_sg_id                 = aws_security_group.alb.id
  ec2_sg_id                 = aws_security_group.ec2.id
  ec2_instance_profile_name = aws_iam_instance_profile.ec2.name
  acm_certificate_arn       = module.dns.certificate_arn
  ami_id                    = var.ami_id
  instance_type             = var.instance_type
  app_port                  = var.app_port
  health_check_path         = var.health_check_path
  asg_min                   = var.asg_min
  asg_desired               = var.asg_desired
  asg_max                   = var.asg_max
  artifacts_bucket_name     = var.artifacts_bucket_name

  depends_on = [aws_iam_instance_profile.ec2]
}

# ──────────────────────────────────────────────
# Route53 A record → ALB (dag-dubai account)
# Standalone to avoid circular dependency with compute
# ──────────────────────────────────────────────
resource "aws_route53_record" "app" {
  provider = aws.dns

  zone_id = module.dns.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = module.compute.alb_dns_name
    zone_id                = module.compute.alb_zone_id
    evaluate_target_health = true
  }

  depends_on = [module.compute]
}

# ──────────────────────────────────────────────
# CodeDeploy
# ──────────────────────────────────────────────
module "codedeploy" {
  source = "../../dag-infrastructure/modules/codedeploy"

  project             = var.project
  environment         = var.environment
  codedeploy_role_arn = aws_iam_role.codedeploy.arn
  asg_name            = module.compute.asg_name
  target_group_name   = "${var.project}-${var.environment}-tg"

  depends_on = [module.compute]
}
