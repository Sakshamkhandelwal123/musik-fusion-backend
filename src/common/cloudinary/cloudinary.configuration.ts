import { v2 } from 'cloudinary';

import { applicationConfig } from 'config';

export const CloudinaryConfiguration = {
  provide: 'Cloudinary',
  useFactory: (): any => {
    return v2.config({
      cloud_name: applicationConfig.cloudinary.cloudName,
      api_key: applicationConfig.cloudinary.apiKey,
      api_secret: applicationConfig.cloudinary.apiSecretKey,
    });
  },
};
