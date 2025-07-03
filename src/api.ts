const API_URL = 'http://localhost:8080';

export function getToken() {
  return localStorage.getItem('token');
}

export async function apiRequest(endpoint: string, options: any = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    throw new Error('Erro na requisição');
  }
  // Se for 204 ou corpo vazio, não tente fazer .json()
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}