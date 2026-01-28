#!/bin/bash

echo "========================================"
echo "  PDF Pal - Deploy to AWS S3"
echo "========================================"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed!"
    echo "Please install from: https://aws.amazon.com/cli/"
    exit 1
fi

# Build the app
echo "[1/3] Building the application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful!"
echo ""

# Get bucket name
read -p "Enter your S3 bucket name: " BUCKET_NAME
if [ -z "$BUCKET_NAME" ]; then
    echo "❌ Bucket name cannot be empty!"
    exit 1
fi

# Upload to S3
echo "[2/3] Uploading to S3 bucket: $BUCKET_NAME..."
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    echo "Make sure:"
    echo "- AWS CLI is configured (run: aws configure)"
    echo "- Bucket exists and you have permissions"
    exit 1
fi
echo "✅ Upload successful!"
echo ""

# Optional: Invalidate CloudFront
read -p "Enter CloudFront Distribution ID (or press Enter to skip): " CLOUDFRONT_ID
if [ ! -z "$CLOUDFRONT_ID" ]; then
    echo "[3/3] Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
    echo "✅ CloudFront invalidated!"
else
    echo "[3/3] Skipping CloudFront invalidation"
fi

echo ""
echo "========================================"
echo "  Deployment Complete! 🎉"
echo "========================================"
echo ""
echo "Your app is now live at:"
echo "http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
echo ""
echo "(Or your CloudFront URL if configured)"
echo ""

