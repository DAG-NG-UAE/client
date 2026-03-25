#!/bin/bash
set -e

echo "Validating deployment..."

# Give the app a moment to fully start
sleep 10

# Check the app responds on port 3000
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)

if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "308" ]; then
  echo "Validation failed: GET / returned HTTP $HTTP_CODE"
  exit 1
fi

echo "Validation passed: GET / returned HTTP $HTTP_CODE."
