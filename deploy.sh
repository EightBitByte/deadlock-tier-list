#!/bin/bash

# Ask for Docker Hub username
read -p "Enter your Docker Hub username: " DOCKER_USER

IMAGE_NAME="deadlock-tierlist"
FULL_IMAGE="$DOCKER_USER/$IMAGE_NAME:latest"

echo "➡️  Building image for linux/amd64 (Server Architecture)..."
# We use --platform linux/amd64 because your server is likely AMD64 Linux
# If you are on an M1/M2 Mac, this ensures compatibility with the server.
docker build --platform linux/amd64 -t $FULL_IMAGE .

echo "➡️  Pushing image to Docker Hub ($FULL_IMAGE)..."
docker push $FULL_IMAGE

echo "✅  Done! On your Linode, verify docker-compose.yml uses image: $FULL_IMAGE and run 'docker-compose up -d'"
