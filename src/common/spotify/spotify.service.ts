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
      baseURL: 'https://accounts.spotify.com',
    });
  }

  async getToken() {
    const data = {
      grant_type: 'client_credentials',
      client_id: applicationConfig.spotify.clientId,
      client_secret: applicationConfig.spotify.clientSecret,
    };

    const token = await this.axiosAccountClient.post('/api/token', data, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    return token.data.access_token;
  }

  async getRefreshToken(refreshToken: string) {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const authToken =
      'Basic ' +
      Buffer.from(
        applicationConfig.spotify.clientId +
          ':' +
          applicationConfig.spotify.clientSecret,
      ).toString('base64');

    const token = await this.axiosAccountClient.post('/api/token', data, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: authToken,
      },
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

  async me(accessToken: string) {
    const result = await this.axiosRequest('GET', '/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return result;
  }

  async fetchProfile(userId: string, accessToken: string) {
    const result = await this.axiosRequest('GET', '/users/' + userId, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return result;
  }
}
