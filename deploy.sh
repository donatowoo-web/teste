#!/bin/bash
# Deploy script for evaplace.pt
# Builds the Next.js site and deploys to the server via SSH

set -e

SERVER="evaplace@km31109.keymachine.de"
SSH_KEY="$HOME/.ssh/id_ed25519"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no"
REMOTE_DIR="/www/out"

cd "$(dirname "$0")"

echo "Building site..."
npm run build

echo "Compressing build output..."
tar -czf /tmp/out.tar.gz -C out .

echo "Uploading to server..."
scp $SSH_OPTS /tmp/out.tar.gz "$SERVER:/www/out.tar.gz"

echo "Deploying on server..."
ssh $SSH_OPTS "$SERVER" "cd /www && rm -rf out_old && mv out out_old && mkdir out && tar -xzf out.tar.gz -C out && rm out.tar.gz"

rm /tmp/out.tar.gz

echo "Deploy complete! Site live at https://evaplace.pt"
