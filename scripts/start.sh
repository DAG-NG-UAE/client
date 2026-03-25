#!/bin/bash
set -e

APP_DIR="/var/app/dag-client"
APP_NAME="dag-client"

echo "Starting $APP_NAME via pm2..."
cd "$APP_DIR"

# Load env vars into current shell (set -a exports all sourced vars)
if [ -f /etc/dag-client.env ]; then
  set -a
  source /etc/dag-client.env
  set +a
fi

# Always delete existing pm2 process so fresh start picks up the current env vars
/usr/bin/pm2 delete $APP_NAME 2>/dev/null || true

# Start Next.js — pm2 inherits the current shell environment
/usr/bin/pm2 start node_modules/.bin/next --name $APP_NAME -- start --port 3000

# Save pm2 process list so it survives reboots
/usr/bin/pm2 save

echo "Start script complete."
