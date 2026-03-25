variable "project" {
  description = "Project name prefix for all resources"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "root_domain" {
  description = "Root domain managed in Route53 dag-dubai account (e.g. dagindustries.com)"
  type        = string
}

variable "domain_name" {
  description = "Full domain name for the app (e.g. jobs.dagindustries.com)"
  type        = string
}

variable "ami_id" {
  description = "Amazon Linux 2023 AMI ID for af-south-1 — update when new AMI released"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "app_port" {
  description = "Port the Next.js app listens on"
  type        = number
  default     = 3000
}

variable "health_check_path" {
  description = "HTTP path for ALB health checks"
  type        = string
  default     = "/"
}

variable "asg_min" {
  description = "ASG minimum instance count"
  type        = number
}

variable "asg_desired" {
  description = "ASG desired instance count"
  type        = number
}

variable "asg_max" {
  description = "ASG maximum instance count"
  type        = number
}

variable "artifacts_bucket_name" {
  description = "S3 bucket name for CodeDeploy artifacts"
  type        = string
}

variable "github_trusted_accounts" {
  description = "List of GitHub accounts/orgs whose Actions workflows can assume the AWS role"
  type        = list(string)
}

variable "dns_access_key" {
  description = "AWS access key for the dag-dubai account (Route53 only) — set as TF_VAR_dns_access_key in CI"
  type        = string
  sensitive   = true
}

variable "dns_secret_key" {
  description = "AWS secret key for the dag-dubai account (Route53 only) — set as TF_VAR_dns_secret_key in CI"
  type        = string
  sensitive   = true
}
