import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';

interface Pedido {
  id: number;
  data: string;
  endereco: string;
  valorTotal: number;
  itens: { pizzaNome: string; quantidade: number }[];
}

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await apiRequest('/pedidos');
        setPedidos(data);
      } catch (err) {
        setError('Erro ao carregar pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Meus Pedidos</h2>
      {loading && <div>Carregando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && pedidos.length === 0 && (
        <div className="alert alert-info">Nenhum pedido encontrado.</div>
      )}
      {!loading && !error && pedidos.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Data</th>
              <th>Endereço</th>
              <th>Itens</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.data).toLocaleString()}</td>
                <td>{p.endereco}</td>
                <td>
                  {p.itens.map(i => (
                    <div key={i.pizzaNome}>{i.pizzaNome} x{i.quantidade}</div>
                  ))}
                </td>
                <td>R$ {p.valorTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PedidosPage;
