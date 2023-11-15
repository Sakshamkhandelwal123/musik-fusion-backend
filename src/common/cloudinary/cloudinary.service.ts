import toStream = require('buffer-to-stream');
import { v2, UploadApiResponse } from 'cloudinary';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

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
}
