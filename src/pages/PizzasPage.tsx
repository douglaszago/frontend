import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { useCarrinho } from '../components/CarrinhoContext';
import PizzaFormPage from './PizzaFormPage';

interface Pizza {
  id: number;
  sabor: string;
  ingredientes: { nome: string; quantidade: string }[];
  cardapio: { preco: number; tamanho: string }[];
}

const PizzasPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPizza, setEditPizza] = useState<any>(null);
  const { adicionar } = useCarrinho();

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/pizza');
      setPizzas(data);
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
      setError('Erro ao carregar pizzas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Pizzas</h2>
      {isAdmin && (
        <button className="btn btn-primary mb-3" onClick={() => { setEditPizza(null); setShowForm(true); }}>
          Cadastrar Pizza
        </button>
      )}
      {showForm && (
        <PizzaFormPage pizza={editPizza} onSave={() => { setShowForm(false); setEditPizza(null); fetchPizzas(); }} />
      )}
      {loading && <div>Carregando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && !showForm && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Ingredientes</th>
              <th></th>
              {isAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {pizzas.map((pizza) => (
              <tr key={pizza.id}>
                <td>{pizza.sabor}</td>
                <td>
                  {pizza.cardapio && pizza.cardapio.length > 0
                    ? pizza.cardapio.map((c, idx) => (
                        <div key={idx}>{c.tamanho}: R$ {typeof c.valor === 'number' ? c.valor.toFixed(2) : (typeof c.preco === 'number' ? c.preco.toFixed(2) : '-')}</div>
                      ))
                    : '-'}
                </td>
                <td>{pizza.ingredientes.map(i => `${i.nome} (${i.quantidade})`).join(', ')}</td>
                <td>
                  <button className="btn btn-sm btn-success" onClick={() => {
                    // Adiciona ao carrinho o menor preço disponível
                    const menor = pizza.cardapio && pizza.cardapio.length > 0 ? pizza.cardapio.reduce((a, b) => a.preco < b.preco ? a : b) : null;
                    if (menor) {
                      adicionar({ id: pizza.id, nome: pizza.sabor, preco: menor.preco });
                    }
                  }}>Adicionar ao carrinho</button>
                </td>
                {isAdmin && (
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => { setEditPizza(pizza); setShowForm(true); }}>Editar</button>
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

export default PizzasPage;
