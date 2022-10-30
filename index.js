"use strict";

const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  signatureVersion: "v4",
});
const Sharp = require("sharp");

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const ALLOWED_RESOLUTIONS = process.env.ALLOWED_RESOLUTIONS
  ? new Set(process.env.ALLOWED_RESOLUTIONS.split(/\s*,\s*/))
  : new Set([]);

exports.handler = function (event, context, callback) {
  const key = event.queryStringParameters.key;
  const match = key.split('/');

  const resolution = match[0].split('x');
  const width = parseInt(resolution[0], 10);
  const height = resolution.length > 1 ? parseInt(resolution[1], 10) : -1;

  let quality = 100;
  let originalKey = match[1];
  if (match.length > 2) {
    quality = parseInt(match[1], 10);
    originalKey = match[2];
  }

  const fileKey = originalKey.split(".");
  fileKey.splice(fileKey.length - 1, 1, "png");

  S3.getObject({ Bucket: BUCKET, Key: fileKey.join(".") })
    .promise()
    .then((data) => {
      let temp = Sharp(data.Body)
      if(height <= 0) {
        temp = temp.resize({
          fit: Sharp.fit.contain,
          width: width
        })
      } else {
        temp = temp.resize({
          width: width,
          height: height,
          fit: Sharp.fit.inside,
          background: {
            r: 0,
            g: 0,
            b: 0,
            alpha: 0,
          },
        })
      }
      return temp.webp({
        quality: quality,
      })
      .toBuffer()
    })
    .then((buffer) =>
      S3.putObject({
        Body: buffer,
        Bucket: BUCKET,
        ContentType: "image/webp",
        Key: key,
      }).promise()
    )
    .then(() =>
      callback(null, {
        statusCode: "301",
        headers: { location: `${URL}/${key}` },
        body: "",
      })
    )
    .catch((err) => callback(err));
};
