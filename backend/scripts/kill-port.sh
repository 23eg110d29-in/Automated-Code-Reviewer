#!/usr/bin/env sh
PORT="${1:-5000}"

echo "Checking port ${PORT}..."
PIDS=$(lsof -ti :"${PORT}")

if [ -z "$PIDS" ]; then
  echo "No process is listening on port ${PORT}."
  exit 0
fi

echo "$PIDS" | xargs kill -9
echo "Stopped process(es) on port ${PORT}."
