#!/bin/sh
set -eu
cd /workspace

# Start app if not already healthy
if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  npm run dev >>/tmp/app-startup.log 2>&1 &
  # Wait up to ~30s for first response
  i=0
  while [ "$i" -lt 30 ]; do
    if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
      break
    fi
    i=$((i + 1))
    sleep 1
  done
fi

# Pin preview proxy to the app + public visibility (survives hibernate/revive)
if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:6015/__control/healthz; then
  curl -sf --max-time 2 -X POST "http://127.0.0.1:6015/__control/target" \
    -H 'content-type: application/json' \
    -d '{"port":8080}' >/dev/null || true
  curl -sf --max-time 2 -X POST "http://127.0.0.1:6015/__control/visibility" \
    -H 'content-type: application/json' \
    -d '{"mode":"public"}' >/dev/null || true
fi

exit 0
