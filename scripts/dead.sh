#!/bin/bash

# Commit and push to GitHub
# Usage: ./scripts/commit-and-push.sh "Your commit message"

set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/commit-and-push.sh \"Your commit message\""
  exit 1
fi

COMMIT_MESSAGE="$1"

echo "📦 Staging changes..."
git add -A

echo "📝 Committing with message: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

echo "🚀 Pushing to origin main..."
git push origin main

echo "✅ Done! Changes pushed to GitHub."
