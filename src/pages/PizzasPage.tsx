import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { useCarrinho } from '../components/CarrinhoContext';
import PizzaFormPage from './PizzaFormPage';

interface CardapioItem {
  preco?: number;
  valor?: number;
  tamanho: string;
}

interface Pizza {
  id: number;
  sabor: string;
  ingredientes: { nome: string; quantidade: string }[];
  cardapio: CardapioItem[];
}

const PizzasPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPizza, setEditPizza] = useState<any>(null);
  const { adicionar } = useCarrinho();
  const [mensagem, setMensagem] = useState<string | null>(null);

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/pizza');
      const pizzasNormalizadas = data.map((pizza: any) => ({
        ...pizza,
        ingredientes: Array.isArray(pizza.ingredientes)
          ? pizza.ingredientes.map((ing: any) => ({
              nome: ing.nome ?? ing.ingrediente ?? '',
              quantidade: ing.quantidade ?? ''
            }))
          : []
      }));
      setPizzas(pizzasNormalizadas);
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
      {mensagem && (
        <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex:9999, minWidth:300}}>{mensagem}</div>
      )}
      {isAdmin && (
        <>
          <button className="btn btn-primary mb-3" onClick={() => { setEditPizza(null); setShowForm(true); }}>
            Cadastrar Pizza
          </button>
        </>
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
                <td>{pizza.ingredientes && pizza.ingredientes.length > 0 ? pizza.ingredientes.map(i => `${i.nome} (${i.quantidade})`).join(', ') : '-'}</td>
                <td>
                  <button className="btn btn-sm btn-success" onClick={() => {
                    const menor = pizza.cardapio && pizza.cardapio.length > 0 ? pizza.cardapio.reduce((a, b) => {
                      const aPreco = typeof a.valor === 'number' ? a.valor : a.preco;
                      const bPreco = typeof b.valor === 'number' ? b.valor : b.preco;
                      return (aPreco ?? Infinity) < (bPreco ?? Infinity) ? a : b;
                    }) : null;
                    if (menor) {
                      const preco = typeof menor.valor === 'number' ? menor.valor : menor.preco;
                      if (typeof preco === 'number') {
                        adicionar({ pizzaId: pizza.id, sabor: pizza.sabor, preco });
                        setMensagem('Pizza adicionada ao carrinho!');
                        setTimeout(() => setMensagem(null), 2000);
                      } else {
                        setMensagem('Erro ao adicionar pizza: preço inválido.');
                        setTimeout(() => setMensagem(null), 2000);
                      }
                    } else {
                      setMensagem('Erro ao adicionar pizza: cardápio não encontrado.');
                      setTimeout(() => setMensagem(null), 2000);
                    }
                  }}>Adicionar ao carrinho</button>
                </td>
                {isAdmin && (
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => { setEditPizza(pizza); setShowForm(true); }}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={async () => {
                      if (window.confirm('Tem certeza que deseja excluir esta pizza?')) {
                        try {
                          await apiRequest(`/pizza/${pizza.id}`, { method: 'DELETE' });
                          setMensagem('Pizza excluída com sucesso!');
                          fetchPizzas();
                          setTimeout(() => setMensagem(null), 2000);
                        } catch {
                          setMensagem('Erro ao excluir pizza.');
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

export default PizzasPage;
