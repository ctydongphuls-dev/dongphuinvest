#!/bin/bash

# Simple script to test the deploy.sh structure
echo "Checking deploy.sh exists..."
if [ -f "deploy.sh" ]; then
    echo "✓ deploy.sh exists"
else
    echo "✗ deploy.sh not found"
    exit 1
fi

echo "Checking script is executable..."
if [ -x "deploy.sh" ]; then
    echo "✓ Script is executable"
else
    echo "✗ Script not executable"
    exit 1
fi

echo "Checking script contains required configuration..."
if grep -q "ctydongphuls@gmail.com" deploy.sh && grep -q "dongphuinvest" deploy.sh; then
    echo "✓ Configuration contains correct email and repository name"
else
    echo "✗ Configuration missing required fields"
    exit 1
fi

echo "Checking script has all essential functions..."
essential_functions=("print_message" "print_error" "print_success" "print_info" "print_warning")
for func in "${essential_functions[@]}"; do
    if grep -q "function $func" deploy.sh; then
        echo "✓ Function $func exists"
    else
        echo "✗ Function $func missing"
        exit 1
    fi
done

echo -e "\n✅ Deployment script is properly configured!"
echo "Usage: ./deploy.sh <your-github-personal-access-token>"
