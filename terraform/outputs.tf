output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.compute.alb_dns_name
}

output "app_url" {
  description = "Public URL of the client app"
  value       = module.dns.app_url
}

output "artifacts_bucket_name" {
  description = "S3 bucket name for deployment artifacts"
  value       = module.compute.artifacts_bucket_name
}

output "codedeploy_app_name" {
  description = "CodeDeploy application name (use as CODEDEPLOY_APP_NAME secret in GitHub Actions)"
  value       = module.codedeploy.app_name
}

output "codedeploy_deployment_group_name" {
  description = "CodeDeploy deployment group name (use as CODEDEPLOY_DEPLOYMENT_GROUP secret in GitHub Actions)"
  value       = module.codedeploy.deployment_group_name
}

output "github_actions_role_arn" {
  description = "ARN of the GitHub Actions IAM role (use as AWS_ROLE_ARN secret in GitHub Actions)"
  value       = aws_iam_role.github_actions.arn
}
