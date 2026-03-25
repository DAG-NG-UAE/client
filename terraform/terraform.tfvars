project     = "dag-client"
environment = "production"
region      = "af-south-1"

root_domain = "dagindustries.com"
domain_name = "jobs.dagindustries.com"

# Amazon Linux 2023 AMI for af-south-1 (update periodically)
# To find latest: aws ec2 describe-images --owners amazon \
#   --filters "Name=name,Values=al2023-ami-*-x86_64" \
#   --query "sort_by(Images,&CreationDate)[-1].ImageId" \
#   --region af-south-1
ami_id = "ami-0dfd094720a0e5372"

instance_type = "t3.medium"
app_port      = 3000

health_check_path = "/"

asg_min     = 1
asg_desired = 1
asg_max     = 3

artifacts_bucket_name = "dag-client-artifacts-production"

# GitHub accounts/orgs allowed to assume the AWS role via OIDC
# DAG-NG-UAE: owns dag-hr-portal client repo (deploy workflows)
github_trusted_accounts = ["DAG-NG-UAE"]

# dns_access_key and dns_secret_key are NOT committed — set as:
#   TF_VAR_dns_access_key and TF_VAR_dns_secret_key in CI / local env
