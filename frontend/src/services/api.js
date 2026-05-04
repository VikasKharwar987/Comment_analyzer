import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://toxicity-analyzer-backend.onrender.com',
  baseURL: 'http://127.0.0.1:8000',
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAnalysis = async (videoUrl) => {
  const response = await api.get('/analyze', { params: { video_url: videoUrl } });
  return response.data;
};

export default api;
