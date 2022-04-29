#!/bin/bash

source ../bash/env.sh

TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo Creating docker image...
docker build -t ba-web-$TIMESTAMP .

# save image into
docker save -o ../images/ba-web-$TIMESTAMP.tar ba-web-$TIMESTAMP

echo Compressing image...
gzip -c ../images/ba-web-$TIMESTAMP.tar > ../images/ba-web-$TIMESTAMP.tar.gz

echo Copying image to EC2...
scp -i $EC2_KEYPAIR_PATH ../images/ba-web-$TIMESTAMP.tar.gz $EC2_USER@$EC2_ADDRESS:$EC2_IMAGES_PATH

echo Running image on EC2...
ssh -i $EC2_KEYPAIR_PATH $EC2_USER@$EC2_ADDRESS "gzip -d $EC2_IMAGES_PATH/ba-web-$TIMESTAMP.tar.gz && docker load -i $EC2_IMAGES_PATH/ba-web-$TIMESTAMP.tar && docker run -p 80:80 ba-web-$TIMESTAMP"
