import axios from 'axios';

// Base URL for your API (can be configured via environment variables)
export const API_BASE_URL =  'http://localhost:5000'; // Backend url - Base URL should not include specific endpoints like /api or /requisition

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach potentially auth tokens (requisition_Id will be dynamic and passed with each request)
axiosInstance.interceptors.request.use(
  (config) => {
    // Requisition_Id will be passed dynamically per request or through context, not as a global header.
    // Example: Attach authorization token if available
    // const authToken = localStorage.getItem('authToken');
    // if (authToken) {
    //   config.headers.Authorization = `Bearer ${authToken}`;
    // }
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
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
      console.error('API Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
