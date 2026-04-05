import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { badRequest } from '../lib/errors.js';

const configured = Boolean(
  env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret,
);

if (configured) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
}

export async function uploadImageBuffer(fileBuffer) {
  if (!configured) {
    throw badRequest('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'socialfeed/posts', resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
}
