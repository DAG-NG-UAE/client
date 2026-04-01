#!/bin/bash
set -e

APP_NAME="dag-client"

# Stop the app if pm2 is managing it
if [ -x /usr/bin/pm2 ]; then
  if /usr/bin/pm2 list | grep -q "$APP_NAME"; then
    echo "Stopping $APP_NAME via pm2..."
    /usr/bin/pm2 stop $APP_NAME || true
    /usr/bin/pm2 delete $APP_NAME || true
  fi
fi

echo "Stop script complete."
