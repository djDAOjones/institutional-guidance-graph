#!/bin/bash
# Dev server restart script — clears caches and starts fresh local dev server
# Usage: ./scripts/dev.sh

set -e

echo "🧹 Cleaning caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

echo "📦 Installing dependencies (if needed)..."
npm install --prefer-offline

echo "🔨 Building TypeScript types..."
npm run type-check

echo "✨ Starting dev server..."
npm run dev
