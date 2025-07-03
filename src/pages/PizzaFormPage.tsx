import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';

interface Ingrediente {
  ingrediente: string;
  quantidade: string;
}

interface CardapioOption {
  valor: number;
  tamanho: string;
}

interface PizzaForm {
  sabor: string;
  ingredientes: { ingrediente: string; quantidade: string }[];
  cardapio: CardapioOption[];
}

interface Pizza {
  id: number;
  sabor: string;
  ingredientes: { ingrediente: string; quantidade: string }[];
  cardapio: CardapioOption[];
}

const PizzaFormPage: React.FC<{ pizza?: Pizza; onSave: () => void }> = ({ pizza, onSave }) => {
  const [sabor, setSabor] = useState(pizza?.sabor || '');
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>(pizza?.ingredientes || []);
  const [cardapio, setCardapio] = useState<CardapioOption[]>(pizza?.cardapio || []);
  const [nomeIngrediente, setNomeIngrediente] = useState('');
  const [quantidadeIngrediente, setQuantidadeIngrediente] = useState('');
  const [preco, setPreco] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [error, setError] = useState('');

  const handleAddIngrediente = () => {
    if (!nomeIngrediente || !quantidadeIngrediente) return;
    setIngredientes([...ingredientes, { ingrediente: nomeIngrediente, quantidade: quantidadeIngrediente }]);
    setNomeIngrediente('');
    setQuantidadeIngrediente('');
  };

  const handleRemoveIngrediente = (idx: number) => {
    setIngredientes(ingredientes.filter((_, i) => i !== idx));
  };

  const handleAddCardapio = () => {
    if (!preco || !tamanho) return;
    setCardapio([...cardapio, { valor: parseFloat(preco), tamanho }]);
    setPreco('');
    setTamanho('');
  };

  const handleRemoveCardapio = (idx: number) => {
    setCardapio(cardapio.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!sabor || ingredientes.length === 0 || cardapio.length === 0) {
      setError('Preencha todos os campos.');
      return;
    }
    const payload = {
      sabor,
      ingredientes,
      cardapio
    };
    try {
      if (pizza) {
        await apiRequest(`/pizza/${pizza.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest('/pizza', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      onSave();
    } catch {
      setError('Erro ao salvar pizza.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Sabor</label>
        <input type="text" className="form-control" value={sabor} onChange={e => setSabor(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Ingredientes</label>
        <div className="d-flex mb-2">
          <input type="text" className="form-control me-2" placeholder="Nome do ingrediente" value={nomeIngrediente} onChange={e => setNomeIngrediente(e.target.value)} />
          <input type="text" className="form-control me-2" placeholder="Quantidade (ex: 200g)" value={quantidadeIngrediente} onChange={e => setQuantidadeIngrediente(e.target.value)} />
          <button type="button" className="btn btn-secondary" onClick={handleAddIngrediente}>Adicionar</button>
        </div>
        <ul className="list-group">
          {ingredientes.map((ing, idx) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
              {ing.ingrediente} ({ing.quantidade})
              <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveIngrediente(idx)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-3">
        <label className="form-label">Opções de Cardápio</label>
        <div className="d-flex mb-2">
          <input type="text" className="form-control me-2" placeholder="Tamanho" value={tamanho} onChange={e => setTamanho(e.target.value)} />
          <input type="number" className="form-control me-2" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
          <button type="button" className="btn btn-secondary" onClick={handleAddCardapio}>Adicionar</button>
        </div>
        <ul className="list-group">
          {cardapio.map((c, idx) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
              {c.tamanho} - R$ {(c.valor).toFixed(2)}
              <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveCardapio(idx)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-success">{pizza ? 'Salvar' : 'Cadastrar'}</button>
    </form>
  );
};

export default PizzaFormPage;
