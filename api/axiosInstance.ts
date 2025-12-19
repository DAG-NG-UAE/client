import axios from 'axios';
import { setUserLogout } from "@/redux/slices/auth";
import { dispatch } from '@/redux/dispatchHandle';

// Base URL for your API (can be configured via environment variables)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // Backend url - Base URL should not include specific endpoints like /api or /requisition

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach potentially auth tokens (requisition_Id will be dynamic and passed with each request)
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.message === 'Authentication required. Please log in.') {
        dispatch(setUserLogout({}));
        window.location.href = '/login';
      }
      console.log(`the error response is => ${error}`)
    
    }  else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
