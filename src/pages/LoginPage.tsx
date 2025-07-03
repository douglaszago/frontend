import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api';

const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const email = (document.getElementById('username') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const token = response.token;
      localStorage.setItem('token', token);
      navigate('/cardapio');
    } catch (err: any) {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuário ou E-mail</label>
          <input
            type="text"
            className="form-control"
            id="username"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Entrar</button>
      </form>
      <div className="mt-3 text-center">
        <span>Não tem cadastro? </span>
        <Link to="/cadastro-cliente">Cadastre-se aqui</Link>
      </div>
    </div>
  );
};

export default LoginPage;
