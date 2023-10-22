import 'dotenv/config';

import { environment } from 'src/utils/constants';

export const applicationConfig = {
  app: {
    env: process.env.APP_ENV,
    isDevelopment: process.env.APP_ENV === environment.DEVELOPMENT,
    isProduction: process.env.APP_ENV === environment.MAIN,
    port: process.env.APP_ENV === 'development' ? '4000' : '3000',
  },

  database: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  },
};
