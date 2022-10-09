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
  const quality = parseInt(match[4], 10);
  const originalKey = match[5];

  S3.getObject({ Bucket: BUCKET, Key: originalKey })
    .promise()
    .then((data) =>
      Sharp(data.Body)
        .resize(width, height)
        .png({
          quality: quality,
          progressive: true,
        })
        .toBuffer()
    )
    .then((buffer) =>
      S3.putObject({
        Body: buffer,
        Bucket: BUCKET,
        ContentType: "image/png",
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
