// src/api.ts
const API_URL = 'http://localhost:8080';

export function getToken() {
  return localStorage.getItem('token');
}

export async function apiRequest(endpoint: string, options: any = {}) {
  const token = getToken();
  const headers = {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    ...options.headers
  };
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    throw new Error('Erro na requisição');
  }
  return response.json();
}