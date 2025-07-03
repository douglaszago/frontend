import React, { useState } from 'react';
import { apiRequest } from '../api';
import { useNavigate } from 'react-router-dom';

const CadastroClientePage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setLoading(true);
    try {
      const cliente = await apiRequest('/clientes', {
        method: 'POST',
        body: JSON.stringify({ nome, email, telefone, senha })
      });
      localStorage.setItem('clienteId', cliente.id);
      setMensagem('Cliente cadastrado com sucesso! Redirecionando para login...');
      setNome('');
      setEmail('');
      setTelefone('');
      setSenha('');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setMensagem('Erro ao cadastrar cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2>Cadastro de Cliente</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input type="text" className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Telefone</label>
          <input type="text" className="form-control" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input type="password" className="form-control" value={senha} onChange={e => setSenha(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success" disabled={loading}>Cadastrar</button>
      </form>
      {mensagem && <div className="alert alert-info">{mensagem}</div>}
    </div>
  );
};

export default CadastroClientePage;
