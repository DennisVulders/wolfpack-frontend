import axios from 'axios';

const API_BASE_URL = 'https://join.wolfpackit.nl/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: 'Bearer 9bAqXRPplyiGfF6n81NVUGpAqeLI1QHw46aqICVL1BLaGI6',
  },
});

export default axiosInstance;
