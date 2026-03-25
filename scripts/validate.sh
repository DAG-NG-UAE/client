#!/bin/bash
set -e

echo "Validating deployment..."

# Give Next.js time to fully start (cold start on t3.medium needs ~30s)
sleep 30

# Retry up to 5 times — curl exit codes like 52 (empty reply) mean the app
# is still initialising; || echo "000" prevents set -e from aborting early
MAX_ATTEMPTS=5
ATTEMPT=0

until [ $ATTEMPT -ge $MAX_ATTEMPTS ]; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || echo "000")

  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "308" ]; then
    echo "Validation passed: GET / returned HTTP $HTTP_CODE."
    exit 0
  fi

  ATTEMPT=$((ATTEMPT + 1))
  echo "Attempt $ATTEMPT/$MAX_ATTEMPTS: GET / returned HTTP $HTTP_CODE — retrying in 10s..."
  sleep 10
done

echo "Validation failed: app did not respond after $MAX_ATTEMPTS attempts."
exit 1
