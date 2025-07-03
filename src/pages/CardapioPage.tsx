import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../components/CarrinhoContext';

interface CardapioItem {
  id: number;
  pizza: { id: number; sabor: string };
  preco: number;
  tamanho: string;
}

interface Pizza {
  id: number;
  sabor: string;
}

const CardapioPage: React.FC = () => {
  const [itens, setItens] = useState<CardapioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preco, setPreco] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pizzaId, setPizzaId] = useState<number | ''>('');
  const [tamanho, setTamanho] = useState('');
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const { adicionar } = useCarrinho();
  const navigate = useNavigate();

  const fetchCardapio = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/cardapio');
      setItens(data);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setIsAdmin(payload.sub === 'admin');
        } catch {
          setIsAdmin(false);
        }
      }
    } catch (err: any) {
      setError('Erro ao carregar cardápio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardapio();
    apiRequest('/pizza').then(setPizzas).catch(() => setPizzas([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pizzaId) {
      setError('Selecione uma pizza.');
      return;
    }
    if (!tamanho) {
      setError('Digite o tamanho.');
      return;
    }
    const itemData = {
      pizza: { id: pizzaId },
      preco: parseFloat(preco),
      tamanho,
    };
    try {
      if (editId) {
        await apiRequest(`/cardapio/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(itemData)
        });
        setMensagem('Item do cardápio editado com sucesso!');
      } else {
        await apiRequest('/cardapio', {
          method: 'POST',
          body: JSON.stringify(itemData)
        });
        setMensagem('Item do cardápio cadastrado com sucesso!');
      }
      setPizzaId('');
      setPreco('');
      setTamanho('');
      setEditId(null);
      fetchCardapio();
    } catch (err: any) {
      setError('Erro ao salvar item do cardápio.');
    } finally {
      if (!mensagem) setTimeout(() => setMensagem(null), 2000);
    }
  };

  const handleEdit = (item: CardapioItem) => {
    setEditId(item.id);
    setPizzaId(item.pizza.id);
    setPreco(item.preco.toString());
    setTamanho(item.tamanho);
  };

  const handleCancel = () => {
    setEditId(null);
    setPizzaId('');
    setPreco('');
    setTamanho('');
  };

  // Função auxiliar para obter o sabor da pizza pelo id
  const getPizzaSabor = (item: CardapioItem) => {
    if (item.pizza && (item.pizza as any).sabor) return (item.pizza as any).sabor;
    if (pizzas.length > 0) {
      const found = pizzas.find(p => p.id === item.pizza.id);
      if (found && (found as any).sabor) return (found as any).sabor;
    }
    return '-';
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Cardápio</h2>
      </div>
      {mensagem && <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex:9999, minWidth:300}}>{mensagem}</div>}
      {isAdmin && (
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <select className="form-select" value={pizzaId} onChange={e => setPizzaId(Number(e.target.value))} required>
                <option value="">Selecione a pizza</option>
                {pizzas.map(pizza => (
                  <option key={pizza.id} value={pizza.id}>{pizza.sabor}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Tamanho (ex: M, G)" value={tamanho} onChange={e => setTamanho(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <input type="number" step="0.01" className="form-control" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} required />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-success w-100">{editId ? 'Salvar' : 'Cadastrar'}</button>
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
              <th>Pizza</th>
              <th>Tamanho</th>
              <th>Preço</th>
              {!isAdmin && <th></th>}
              {isAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id}>
                <td>{getPizzaSabor(item)}</td>
                <td>{item.tamanho}</td>
                <td>
                  {item.preco !== undefined
                    ? `R$ ${item.preco.toFixed(2)}`
                    : (item as any).valor !== undefined
                    ? `R$ ${(item as any).valor.toFixed(2)}`
                    : '-'}
                </td>
                {!isAdmin && (
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={async () => {
                        await adicionar({
                          pizzaId: item.pizza.id,
                          sabor: getPizzaSabor(item),
                          preco: item.preco
                        });
                        setMensagem('Pizza adicionada ao carrinho!');
                        setTimeout(() => setMensagem(null), 2000);
                      }}
                    >Adicionar ao carrinho</button>
                  </td>
                )}
                {isAdmin && (
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(item)}>Editar</button>
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

export default CardapioPage;
