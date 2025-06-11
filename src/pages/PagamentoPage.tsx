import React, { useState } from 'react';
import { useCarrinho } from '../components/CarrinhoContext';
import { apiRequest } from '../api';

const PagamentoPage: React.FC = () => {
  const { itens, limpar } = useCarrinho();
  const [endereco, setEndereco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');
    try {
      await apiRequest('/pedidos', {
        method: 'POST',
        body: JSON.stringify({
          itens: itens.map(i => ({ pizzaId: i.id, quantidade: i.quantidade })),
          endereco,
          valorTotal: total
        })
      });
      setMensagem('Pedido realizado com sucesso!');
      limpar();
      setEndereco('');
    } catch (err) {
      setMensagem('Erro ao finalizar pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Pagamento</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Endereço de entrega</label>
          <input type="text" className="form-control" value={endereco} onChange={e => setEndereco(e.target.value)} required />
        </div>
        <div className="mb-3">
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </div>
        <button type="submit" className="btn btn-success" disabled={loading || itens.length === 0}>Finalizar Pedido</button>
      </form>
      {mensagem && <div className="alert alert-info">{mensagem}</div>}
    </div>
  );
};

export default PagamentoPage;