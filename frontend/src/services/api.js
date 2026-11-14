import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
};

export const getHealthStatus = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

const storedToken = localStorage.getItem('qms-token');
if (storedToken) {
  setAuthToken(storedToken);
}

export default apiClient;
