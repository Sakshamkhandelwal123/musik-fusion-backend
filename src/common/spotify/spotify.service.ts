import axios, { Axios } from 'axios';
import { Injectable } from '@nestjs/common';

import { applicationConfig } from 'config';

@Injectable()
export class SpotifyService {
  private axiosAccountClient: Axios;
  private axiosApiClient: Axios;

  constructor() {
    this.axiosApiClient = axios.create({
      baseURL: 'https://api.spotify.com/v1',
    });

    this.axiosAccountClient = axios.create({
      baseURL: 'https://accounts.spotify.com/api',
    });
  }

  async getToken() {
    const data = {
      grant_type: 'client_credentials',
      client_id: applicationConfig.spotify.clientId,
      client_secret: applicationConfig.spotify.clientSecret,
    };

    const token = await this.axiosAccountClient.post('/token', data, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    return token.data.access_token;
  }

  async axiosRequest(method: string, url: string, options?: object) {
    const response = await this.axiosApiClient.request({
      method,
      url,
      ...options,
    });

    return response.data;
  }
}
