import axios from 'axios';

// Backend URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Eğer kullanıcı giriş yapmışsa token'ı otomatik isteğe ekler
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;