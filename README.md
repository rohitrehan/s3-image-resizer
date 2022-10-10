# S3 Image Resize and Optimise

## Table of Content

- [Solution Overview](#solution-overview)
- [Architecture Diagram](#architecture-diagram)
- [External Contributors](#external-contributors)
- [License](#license)

## 1. Solution Overview
---

The Serverless Image Handler solution helps to embed images on websites and mobile applications to drive user engagement. It uses [Sharp](https://sharp.pixelplumbing.com/en/stable/) to provide high-speed image processing without sacrificing image quality.

This solution automatically deploys and configures a serverless architecture optimized for dynamic image manipulation. Images can be rendered and returned spontaneously. For example, an image can be resized based on different screen sizes by adding code on a website that leverages this solution to resize the image before being sent to the screen using the image. It uses [Amazon CloudFront](https://aws.amazon.com/cloudfront) for global content delivery and [Amazon Simple Storage Service](https://aws.amazon.com/s3) (Amazon S3) for reliable and durable cloud storage.

## 3. Architecture Diagram
---

![Architecture Diagram](./architecture.png)

The AWS CloudFormation template deploys an Amazon CloudFront distribution, Amazon API Gateway REST API, and an AWS Lambda function. Amazon CloudFront provides a caching layer to reduce the cost of image processing and the latency of subsequent image delivery. The Amazon API Gateway provides endpoint resources and triggers the AWS Lambda function. The AWS Lambda function retrieves the image from the customer's Amazon Simple Storage Service (Amazon S3) bucket and uses Sharp to return a modified version of the image to the API Gateway. Additionally, the solution generates a CloudFront domain name that provides cached access to the image handler API.



## 2. Deploy
---
- Upload the distributable to the Amazon S3 bucket in your account and note the name of S3 bucker & zip file key 
- Deploy the solution to your account by launching a new AWS CloudFormation stack using the stack.yaml from same release package
  - `bucketName`: Name of the bucket which will be used for images
  - `lambdaFunctionCodeBucket`: Name of the bucket where release package is uploaded
  - `lambdaFunctionCodeArchive`: Key of uploaded the code archive (release package)


# External Contributors
