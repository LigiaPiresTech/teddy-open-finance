import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // URL padrão do Back-End NestJS
});

// Interceptor para injetar o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@TeddyOpenFinance:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});