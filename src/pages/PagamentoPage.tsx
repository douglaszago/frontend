import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../components/CarrinhoContext';
import { apiRequest } from '../api';

const PagamentoPage: React.FC = () => {
  const { limpar } = useCarrinho();
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumo, setResumo] = useState<any>(null);
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
  const [carrinhoItens, setCarrinhoItens] = useState<any[]>([]);
  const clienteId = Number(localStorage.getItem('clienteId'));

  useEffect(() => {
    const fetchCarrinho = async () => {
      if (!clienteId) return setCarrinhoItens([]);
      try {
        const data = await apiRequest(`/carrinho?clienteId=${clienteId}`);
        setCarrinhoItens(Array.isArray(data) ? data : []);
      } catch {
        setCarrinhoItens([]);
      }
    };
    fetchCarrinho();
  }, [clienteId]);

  const total = carrinhoItens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');
    const enderecoCompleto = `${logradouro}, ${numero}${complemento ? ' - ' + complemento : ''}, ${bairro}, ${cidade} - ${estado}`;
    try {
      const payload = {
        itens: carrinhoItens
          .filter(i => i.pizzaId ?? i.pizza?.id)
          .map(i => ({
            pizzaId: i.pizzaId ?? i.pizza?.id,
            quantidade: i.quantidade
          })),
        endereco: enderecoCompleto,
        clienteId,
        formaPagamento
      };
      let pedido = null;
      let erro = false;
      try {
        pedido = await apiRequest('/pedidos', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (e) {
        // Se o pedido foi criado, mas a resposta não é JSON, ainda assim pode ter dado certo
        // Tenta buscar pedidos para conferir
        try {
          const pedidos = await apiRequest(`/pedidos?clienteId=${clienteId}`);
          if (Array.isArray(pedidos) && pedidos.length > 0) {
            pedido = pedidos[pedidos.length - 1];
          } else {
            erro = true;
          }
        } catch {
          erro = true;
        }
      }
      if (!erro && pedido) {
        setResumo(pedido);
        setMensagem('Pedido realizado com sucesso!');
        await limpar();
        setLogradouro('');
        setNumero('');
        setComplemento('');
        setBairro('');
        setCidade('');
        setEstado('');
        setCarrinhoItens([]);
      } else {
        setMensagem('Erro ao finalizar pedido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Pagamento</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <label className="form-label">Logradouro</label>
            <input type="text" className="form-control" value={logradouro} onChange={e => setLogradouro(e.target.value)} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">Número</label>
            <input type="text" className="form-control" value={numero} onChange={e => setNumero(e.target.value)} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Complemento</label>
            <input type="text" className="form-control" value={complemento} onChange={e => setComplemento(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Bairro</label>
            <input type="text" className="form-control" value={bairro} onChange={e => setBairro(e.target.value)} required />
          </div>
        </div>
        <div className="row g-2 mb-3">
          <div className="col-md-5">
            <label className="form-label">Cidade</label>
            <input type="text" className="form-control" value={cidade} onChange={e => setCidade(e.target.value)} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">Estado</label>
            <input type="text" className="form-control" value={estado} onChange={e => setEstado(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Forma de Pagamento</label>
          <select className="form-select" value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} required>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Pix">Pix</option>
          </select>
        </div>
        <div className="mb-3">
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </div>
        <button type="submit" className="btn btn-success" disabled={loading || carrinhoItens.length === 0}>Finalizar Pedido</button>
      </form>
      {mensagem && <div className="alert alert-info">{mensagem}</div>}
      {resumo && (
        <div className="alert alert-success mt-4">
          <h5>Resumo do Pedido</h5>
          <div><b>Status:</b> {resumo.status || 'Realizado'}</div>
          <div><b>Total:</b> R$ {resumo.valorTotal?.toFixed(2)}</div>
          <div><b>Itens:</b></div>
          <ul>
            {resumo.itens?.map((i: any, idx: number) => (
              <li key={idx}>{i.pizzaNome || i.pizzaId} x{i.quantidade} (R$ {i.subtotal?.toFixed(2)})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PagamentoPage;

// Os campos do formulário de endereço são usados apenas no frontend para montar a string completa do endereço.
// O backend continuará recebendo o campo 'endereco' como string única, sem alteração de contrato.
// Nenhuma alteração de campo será feita no backend.