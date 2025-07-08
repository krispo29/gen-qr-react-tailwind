#!/bin/bash

# Ensure vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "vercel CLI could not be found. Please install it globally: npm install -g vercel"
    exit 1
fi

if [ "$1" = "staging" ]; then
  echo "Deploying to Staging (Vercel Preview Deployment)..."
  # Copy staging environment variables
  # Make sure you have a .env.staging file in your project root
  if [ -f .env.staging ]; then
    cp .env.staging .env.local
    echo "Copied .env.staging to .env.local"
  else
    echo "Warning: .env.staging not found. Building without specific staging env vars."
  fi
  
  # Build the project using Vite
  echo "Running npm run build..."
  npm run build

  # Deploy the pre-built 'dist' folder to Vercel as a preview deployment
  # This will generate a unique preview URL
  echo "Deploying to Vercel..."
  vercel --prebuilt
elif [ "$1" = "production" ]; then
  echo "Deploying to Production (Vercel Production Deployment)..."
  # Copy production environment variables
  # Make sure you have a .env.production file in your project root
  if [ -f .env.production ]; then
    cp .env.production .env.local
    echo "Copied .env.production to .env.local"
  else
    echo "Warning: .env.production not found. Building without specific production env vars."
  fi

  # Build the project using Vite
  echo "Running npm run build..."
  npm run build

  # Deploy the pre-built 'dist' folder to Vercel as a production deployment
  # This will deploy to your main domain configured in Vercel
  echo "Deploying to Vercel (Production)..."
  vercel --prod --prebuilt
else
  echo "Usage: ./deploy.sh staging | production"
  exit 1
fi

echo "Deployment process finished."