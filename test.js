"use strict";

const Sharp = require("sharp");

  const key = "200x200/hero-image.webp";
  const match = key.split('/');

  const resolution = match[0].split('x');
  const width = parseInt(resolution[0], 10);
  const height = parseInt(resolution[1], 10);

  let quality = 100;
  let originalKey = match[1];
  if (match.length > 2) {
    quality = parseInt(match[1], 10);
    originalKey = match[2];
  }

  const fileKey = originalKey.split(".");
  fileKey.splice(fileKey.length - 1, 1, "png");

  Sharp(fileKey.join('.'))
    .resize({
      width: width,
      height: height,
      fit: 'contain',
      background: {
        r: 0,
        g: 0,
        b: 0,
        alpha: 0
      }
    })
    .webp({
      quality: quality,
    })
    .toFile('resized-' + key.replace('/', '-'));