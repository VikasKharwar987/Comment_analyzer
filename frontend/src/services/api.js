import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const getAnalysis = async (postId) => {
  const response = await api.get(`/analyze/${postId}`);
  return response.data;
};

export default api;
