import React from 'react';
import { Navigate } from 'react-router-dom';

// Função para checar autenticação (mock inicial)
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  let isValid = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isValid = !payload.exp || Date.now() / 1000 < payload.exp;
    } catch {
      isValid = false;
    }
  }
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
