#!/bin/bash

# Git commit and push script
# Usage: ./git-push.sh [commit-message]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default commit message if none provided
DEFAULT_MESSAGE="Update: $(date '+%Y-%m-%d %H:%M:%S')"

# Use provided message or default
COMMIT_MESSAGE="${1:-$DEFAULT_MESSAGE}"

echo -e "${YELLOW}Starting git commit and push process...${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}No changes to commit${NC}"
else
    echo -e "${GREEN}Changes detected, proceeding with commit...${NC}"
    
    # Add all changes
    echo "Adding all changes..."
    git add .
    
    # Show what will be committed
    echo -e "${YELLOW}Files to be committed:${NC}"
    git diff --cached --name-status
    
    # Commit changes
    echo -e "${GREEN}Committing with message: '$COMMIT_MESSAGE'${NC}"
    git commit -m "$COMMIT_MESSAGE"
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}Current branch: $CURRENT_BRANCH${NC}"

# Push to remote
echo -e "${GREEN}Pushing to remote...${NC}"
git push origin "$CURRENT_BRANCH"

echo -e "${GREEN}✅ Successfully committed and pushed to GitHub!${NC}"
