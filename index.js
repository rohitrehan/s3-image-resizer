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
  const match = key.match(/((\d+)x(\d+))\/(\d+)\/(.*)/);

  const resolution = match[1];
  const width = parseInt(match[2], 10);
  const height = parseInt(match[3], 10);

  let quality = 100;
  let originalKey = match[4];
  if (match.length > 5) {
    quality = parseInt(match[4], 10);
    originalKey = match[5];
  }

  const fileKey = originalKey.split(".");
  fileKey.splice(fileKey.length - 1, 1, "png");


  const transparent = {r:0, b:0, g:0, a:0};

  S3.getObject({ Bucket: BUCKET, Key: fileKey.join(".") })
    .promise()
    .then((data) =>
      Sharp(data.Body)
        .flatten()
        .embed()
        .background(transparent)
        .resize(width, height)
        .webp({
          quality: quality,
        })
        .toBuffer()
    )
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
