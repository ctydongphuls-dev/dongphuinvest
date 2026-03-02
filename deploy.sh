#!/bin/bash

# Deployment script for dongphuinvest
# Uses Personal Access Token (PAT) for GitHub authentication

# Configuration
REPO_NAME="dongphuinvest"
REPO_OWNER="dongphuinvest"
GITHUB_EMAIL="ctydongphuls@gmail.com"
GITHUB_NAME="Đồng Phú Lạng Sơn"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print errors
print_error() {
    print_message "$RED" "ERROR: $1"
}

# Function to print success messages
print_success() {
    print_message "$GREEN" "✓ $1"
}

# Function to print info messages
print_info() {
    print_message "$BLUE" "INFO: $1"
}

# Function to print warnings
print_warning() {
    print_message "$YELLOW" "WARNING: $1"
}

# Check if PAT is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <github-personal-access-token>"
    print_info "Generate a PAT at: https://github.com/settings/tokens"
    print_info "Required scopes: repo, workflow"
    exit 1
fi

PAT="$1"

# Verify dependencies
print_info "Verifying dependencies..."

if ! command -v git &> /dev/null; then
    print_error "Git is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "Dependencies verified"

# Configure git user identity
print_info "Configuring git identity..."
git config user.name "$GITHUB_NAME"
git config user.email "$GITHUB_EMAIL"
print_success "Git identity configured"

# Build the project
print_info "Building the project..."
if ! npm run build; then
    print_error "Build failed"
    exit 1
fi
print_success "Build completed successfully"

# Initialize git repository (if not already initialized)
if [ ! -d ".git" ]; then
    print_info "Initializing git repository..."
    git init
    git remote add origin "https://${PAT}@github.com/${REPO_OWNER}/${REPO_NAME}.git"
else
    # Update remote URL with PAT
    print_info "Updating remote URL..."
    git remote set-url origin "https://${PAT}@github.com/${REPO_OWNER}/${REPO_NAME}.git"
fi

# Check if we're on main branch
if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
    print_info "Creating main branch..."
    git checkout -b main
fi

# Add and commit changes
print_info "Committing changes..."
git add .
if git commit -m "Deploy to GitHub Pages $(date +'%Y-%m-%d %H:%M:%S')" 2>/dev/null; then
    print_success "Changes committed"
else
    print_warning "No changes to commit"
fi

# Push to remote repository
print_info "Pushing to remote repository..."
if git push -u origin main --force; then
    print_success "Changes pushed to main branch"
else
    print_error "Push to remote failed"
    exit 1
fi

# Deploy to GitHub Pages
print_info "Deploying to GitHub Pages..."
if ! npm run deploy; then
    print_error "Deployment failed"
    exit 1
fi

print_success "Deployment completed successfully!"
print_info "Your website is available at: https://${REPO_OWNER}.github.io/${REPO_NAME}/"

# Cleanup remote URL (remove PAT from git config)
git remote set-url origin "https://github.com/${REPO_OWNER}/${REPO_NAME}.git"
print_info "Remote URL cleaned up"
