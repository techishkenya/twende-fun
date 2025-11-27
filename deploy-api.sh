#!/bin/bash

# Tracker KE - API Deployment Script
# This script deploys the Firebase Cloud Functions (API Layer)

echo "🚀 Tracker KE - API Deployment"
echo "================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found"
echo ""

# Check if logged in
echo "📝 Checking Firebase login status..."
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase"
    echo "Run: firebase login"
    exit 1
fi

echo "✅ Logged in to Firebase"
echo ""

# Install dependencies
echo "📦 Installing function dependencies..."
cd functions
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi
cd ..
echo ""

# Confirm deployment
echo "⚠️  You are about to deploy Cloud Functions to Firebase."
echo "This will make your API live at:"
echo "https://us-central1-twende-a3958.cloudfunctions.net/api/v1"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

# Deploy functions
echo ""
echo "🚀 Deploying Cloud Functions..."
firebase deploy --only functions

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🎉 Your API is now live!"
    echo "================================"
    echo "API Base URL:"
    echo "https://us-central1-twende-a3958.cloudfunctions.net/api/v1"
    echo ""
    echo "Test it with:"
    echo "curl https://us-central1-twende-a3958.cloudfunctions.net/api/v1/health"
    echo ""
    echo "Next steps:"
    echo "1. Generate API keys in admin panel (/admin/api)"
    echo "2. Share integration guide with supermarkets"
    echo "3. Monitor usage in admin dashboard"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo "Check the error messages above"
    exit 1
fi
