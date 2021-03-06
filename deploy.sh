#!/bin/bash

source ../bash/env.sh

# create docker image
docker build -t web .

# upload to ecr
docker tag web $ECR_URL/web
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL
docker push $ECR_URL/web

# force new deployment
aws ecs update-service --cluster web-cluster --service WebService --force-new-deployment --region us-east-1
