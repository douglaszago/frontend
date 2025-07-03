import React, { useState } from 'react';
import { useCarrinho } from '../components/CarrinhoContext';
import { useNavigate } from 'react-router-dom';

const CarrinhoPage: React.FC = () => {
  const { itens, remover, alterarQuantidade, limpar } = useCarrinho();
  const [mensagem, setMensagem] = useState<string | null>(null);
  const navigate = useNavigate();
  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const handleRemover = async (id: number) => {
    try {
      await remover(id);
      setMensagem('Item removido do carrinho!');
    } catch {
      setMensagem('Erro ao remover item do carrinho.');
    }
    setTimeout(() => setMensagem(null), 2000);
  };

  const handleAlterarQuantidade = async (id: number, quantidade: number) => {
    try {
      await alterarQuantidade(id, quantidade);
      setMensagem('Quantidade atualizada!');
    } catch {
      setMensagem('Erro ao atualizar quantidade.');
    }
    setTimeout(() => setMensagem(null), 2000);
  };

  const handleLimpar = () => {
    limpar();
    setMensagem('Carrinho limpo!');
    setTimeout(() => setMensagem(null), 2000);
  };

  return (
    <div className="container mt-5">
      <h2>Carrinho</h2>
      {mensagem && <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3" style={{zIndex:9999, minWidth:300}}>{mensagem}</div>}
      {itens.length === 0 ? (
        <div className="alert alert-info">Seu carrinho está vazio.</div>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Pizza</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itens.map(item => (
                <tr key={item.id}>
                  <td>{item.sabor || (item as any).nomeProduto || (item as any).nome || (item as any).pizzaNome || '-'}</td>
                  <td>R$ {item.preco.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.quantidade}
                      onChange={e => handleAlterarQuantidade(item.id, Number(e.target.value))}
                      style={{ width: 60 }}
                    />
                  </td>
                  <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemover(item.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-3"><strong>Total: R$ {total.toFixed(2)}</strong></div>
          <button className="btn btn-secondary me-2" onClick={handleLimpar}>Limpar carrinho</button>
          <button className="btn btn-success" onClick={() => navigate('/pagamento')}>Confirmar Pedido</button>
        </>
      )}
    </div>
  );
};

export default CarrinhoPage;
