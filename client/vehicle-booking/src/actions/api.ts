import axios, { AxiosError } from 'axios';
// import { encryptValue } from '../utils/encryptiondecryption'; // If needed

// const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_URL = 'http://localhost:9000/api'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add common headers
api.interceptors.request.use(
  (config) => {
    console.log('config', config);
    
    // Retrieve token from localStorage instead of cookies
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
   
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface IErrorBase<T> {
  error: Error | AxiosError<T>;
  type: 'axios-error' | 'stock-error';
}

interface IAxiosError<T> extends IErrorBase<T> {
  error: AxiosError<T>;
  type: 'axios-error';
}

interface IStockError<T> extends IErrorBase<T> {
  error: Error;
  type: 'stock-error';
}

const axiosErrorHandler = <T>(
  callback: (err: IAxiosError<T> | IStockError<T>) => void
) => {
  return (error: Error | AxiosError<T>) => {
    if (axios.isAxiosError(error)) {
      callback({
        error,
        type: 'axios-error',
      });
    } else {
      callback({
        error,
        type: 'stock-error',
      });
    }
  };
};

export { api, axiosErrorHandler };
