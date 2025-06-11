import React from 'react';
import { useCarrinho } from '../components/CarrinhoContext';

const CarrinhoPage: React.FC = () => {
  const { itens, remover, alterarQuantidade, limpar } = useCarrinho();
  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div className="container mt-5">
      <h2>Carrinho</h2>
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
                  <td>{item.nome}</td>
                  <td>R$ {item.preco.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.quantidade}
                      onChange={e => alterarQuantidade(item.id, Number(e.target.value))}
                      style={{ width: 60 }}
                    />
                  </td>
                  <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => remover(item.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-3"><strong>Total: R$ {total.toFixed(2)}</strong></div>
          <button className="btn btn-secondary me-2" onClick={limpar}>Limpar carrinho</button>
        </>
      )}
    </div>
  );
};

export default CarrinhoPage;
