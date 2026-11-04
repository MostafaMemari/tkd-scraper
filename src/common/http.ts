import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

export type HttpHeaders = Record<string, string | string[] | undefined>;

export interface HttpResult<T> {
  data: T;
  headers: HttpHeaders;
  status: number;
}

@Injectable()
export class HttpService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 15000,
      withCredentials: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      validateStatus: (status) => status >= 200 && status < 500,
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<HttpResult<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get<T>(url, config);

      return {
        data: response.data,
        headers: response.headers as HttpHeaders,
        status: response.status,
      };
    } catch {
      throw new InternalServerErrorException(`HTTP GET failed: ${url}`);
    }
  }

  async post<T>(url: string, data: string, config?: AxiosRequestConfig): Promise<HttpResult<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post<T>(url, data, config);

      return {
        data: response.data,
        headers: response.headers as HttpHeaders,
        status: response.status,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`HTTP POST failed: ${url}`);
    }
  }
}
