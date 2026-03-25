#!/bin/bash
set -e

APP_DIR="/var/app/dag-client"

echo "Installing dependencies..."
cd "$APP_DIR"

# Install production dependencies only (.next is pre-built by CI)
npm ci --omit=dev

# npm ci runs as root; ec2-user runs the app — fix ownership so Next.js
# can write cache files and won't try to auto-install packages at runtime
chown -R ec2-user:ec2-user "$APP_DIR"

# Pull env file from S3 — provides any server-side runtime env vars
# NEXT_PUBLIC_* vars are baked into the build at CI time; this covers future additions
aws s3 cp s3://dag-client-artifacts-production/config/dag-client.env /etc/dag-client.env \
  --region af-south-1 || true
chown ec2-user:ec2-user /etc/dag-client.env 2>/dev/null || true
chmod 600 /etc/dag-client.env 2>/dev/null || true

echo "Install script complete."
