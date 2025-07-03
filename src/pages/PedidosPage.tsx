import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';

interface Pedido {
  id: number;
  data: string;
  endereco: string;
  valorTotal: number;
  formaPagamento?: string;
  itens: {
    pizzaNome?: string;
    pizza?: { sabor?: string; id?: number };
    quantidade: number;
    subtotal?: number;
  }[];
}

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const clienteId = localStorage.getItem('clienteId');
        const url = clienteId ? `/pedidos?clienteId=${clienteId}` : '/pedidos';
        const data = await apiRequest(url);
        setPedidos(Array.isArray(data) ? data : []);
        setMensagem('Pedidos carregados com sucesso!');
        setTimeout(() => setMensagem(null), 2000);
      } catch {
        setError('Erro ao carregar pedidos.');
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Meus Pedidos</h2>
      {mensagem && <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex:9999, minWidth:300}}>{mensagem}</div>}
      {loading && <div>Carregando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && pedidos.length === 0 && (
        <div className="alert alert-info">Nenhum pedido encontrado.</div>
      )}
      {!loading && !error && pedidos.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Endereço</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p, idx) => (
                <tr key={p.id || idx}>
                  <td>{p.endereco || '-'}</td>
                  <td>
                    {Array.isArray(p.itens) && p.itens.length > 0 ? p.itens.map((i, idx2) => (
                      <div key={(i.pizza?.id || i.pizzaNome || idx2) + '-' + idx2}>
                        {(i.pizzaNome || i.pizza?.sabor || 'Pizza')} x{i.quantidade}
                        {typeof i.subtotal === 'number' && (
                          <> — R$ {i.subtotal.toFixed(2)}</>
                        )}
                      </div>
                    )) : '-'}
                  </td>
                  <td>R$ {typeof p.valorTotal === 'number' ? p.valorTotal.toFixed(2) : (typeof (p as any).total === 'number' ? (p as any).total.toFixed(2) : '-')}</td>
                  <td>{p.formaPagamento || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PedidosPage;
