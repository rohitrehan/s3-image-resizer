# S3 Image Resize and Optimise

## 1. Introduction
---
Introduction

## 2. Steps to deploy
---
- upload the release package to s3 bucket, Make a note of bucket name and zip file key 
- Create a new Cloudformation stack using the stack.yaml
  - `bucketName`: Name of the bucket which will be used for images
  - `lambdaFunctionCodeBucket`: Name of the bucket where release package is uploaded
  - `lambdaFunctionCodeArchive`: Key of uploaded the code archive (release package)
