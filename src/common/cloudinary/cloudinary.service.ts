import toStream = require('buffer-to-stream');
import { v2, UploadApiResponse } from 'cloudinary';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { getErrorCodeAndMessage } from 'src/utils/helpers';

@Injectable()
export class CloudinaryService {
  constructor() {}

  async uploadImage(
    folderName: string,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    try {
      const result = await new Promise((resolve, reject) => {
        const cloudStream = v2.uploader.upload_stream(
          { folder: `Musik Fusion/${folderName}` },
          function (err, fileUploaded) {
            if (err) {
              reject(err);
            }

            resolve(fileUploaded);
          },
        );

        toStream(file.buffer).pipe(cloudStream);
      });

      return result as UploadApiResponse;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getImageUrl(publicId: string): Promise<string> {
    try {
      const result = await v2.api.resource(publicId);

      return result.secure_url;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      const result = await v2.uploader.destroy(publicId);

      return result;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
