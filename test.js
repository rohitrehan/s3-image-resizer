"use strict";

const Sharp = require("sharp");

  const key = "200/support.webp";
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

  let temp = Sharp(fileKey.join('.'))
  if(height <= 0) {
    temp = temp.resize({
      fit: Sharp.fit.contain,
      width: 800
    })
  } else {
    temp = temp.resize({
      width: width,
      height: height,
      fit: Sharp.fit.contain,
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
  .toFile('resized-' + key.replace('/', '-'));