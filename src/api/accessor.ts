import axios, { AxiosError, AxiosResponse } from 'axios';
import { BASE_URL, NEWS_API_SECRET_KEY } from '@env';

const $axios = axios.create({
  baseURL: BASE_URL,
});

$axios.interceptors.request.use(
  async config => {
    config.headers['X-Api-Key'] = NEWS_API_SECRET_KEY;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

$axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default $axios;
