import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';

interface IngredienteItem {
  id?: number;
  ingrediente: string;
  quantidade: string;
}

const IngredientesPage: React.FC = () => {
  const [ingredientes, setIngredientes] = useState<IngredienteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ingrediente, setIngrediente] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const fetchIngredientes = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/ingredientes');
      setIngredientes(data);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setIsAdmin(payload.sub === 'admin@admin.com');
        } catch {
          setIsAdmin(false);
        }
      }
    } catch (err: any) {
      setError('Erro ao carregar ingredientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!ingrediente || !quantidade) {
      setError('Preencha todos os campos.');
      return;
    }
    const ingredienteData: IngredienteItem = {
      ingrediente,
      quantidade
    };
    try {
      if (editId) {
        await apiRequest(`/ingredientes/${editId}`, {
          method: 'PUT',
          body: JSON.stringify({ ingrediente, quantidade })
        });
        setMensagem('Ingrediente editado com sucesso!');
      } else {
        await apiRequest('/ingredientes', {
          method: 'POST',
          body: JSON.stringify({ ingrediente, quantidade })
        });
        setMensagem('Ingrediente cadastrado com sucesso!');
      }
      setIngrediente('');
      setQuantidade('');
      setEditId(null);
      fetchIngredientes();
    } catch (err: any) {
      setError('Erro ao salvar ingrediente.');
    } finally {
      if (!mensagem) setTimeout(() => setMensagem(null), 2000);
    }
  };

  const handleEdit = (ing: IngredienteItem) => {
    setEditId(ing.id || null);
    setIngrediente(ing.ingrediente);
    setQuantidade(ing.quantidade);
  };

  const handleCancel = () => {
    setEditId(null);
    setIngrediente('');
    setQuantidade('');
  };

  return (
    <div className="container mt-5">
      <h2>Ingredientes</h2>
      {mensagem && <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex:9999, minWidth:300}}>{mensagem}</div>}
      {isAdmin && (
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Ingrediente" value={ingrediente} onChange={e => setIngrediente(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Quantidade (ex: 200g)" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-success w-100">Cadastrar Ingrediente</button>
            </div>
          </div>
          {editId && <button type="button" className="btn btn-secondary mt-2" onClick={handleCancel}>Cancelar edição</button>}
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </form>
      )}
      {loading && <div>Carregando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Quantidade</th>
              {isAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ing) => (
              <tr key={ing.id}>
                <td>{ing.ingrediente}</td>
                <td>{ing.quantidade}</td>
                {isAdmin && (
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(ing)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={async () => {
                      if (window.confirm('Tem certeza que deseja excluir este ingrediente?')) {
                        try {
                          await apiRequest(`/ingredientes/${ing.id}`, { method: 'DELETE' });
                          setMensagem('Ingrediente excluído com sucesso!');
                          fetchIngredientes();
                          setTimeout(() => setMensagem(null), 2000);
                        } catch {
                          setMensagem('Erro ao excluir ingrediente.');
                          setTimeout(() => setMensagem(null), 2000);
                        }
                      }
                    }}>Excluir</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IngredientesPage;
