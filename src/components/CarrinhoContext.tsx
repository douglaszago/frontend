import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../api';

export interface CarrinhoItem {
  id: number; // id do item no carrinho (gerado pelo backend)
  pizzaId: number;
  sabor: string;
  preco: number;
  quantidade: number;
}

interface CarrinhoContextType {
  itens: CarrinhoItem[];
  adicionar: (pizza: { pizzaId: number; sabor: string; preco: number }) => Promise<void>;
  remover: (id: number) => Promise<void>;
  alterarQuantidade: (id: number, quantidade: number) => Promise<void>;
  limpar: () => Promise<void>;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);
  const clienteId = Number(localStorage.getItem('clienteId'));

  // Buscar carrinho do backend ao carregar
  useEffect(() => {
    const fetchCarrinho = async () => {
      if (!clienteId) return setItens([]);
      try {
        const data = await apiRequest(`/carrinho?clienteId=${clienteId}`);
        // Ajuste: converte nomeProduto para sabor
        const itensNormalizados = Array.isArray(data)
          ? data.map((item: any) => ({
              ...item,
              sabor: item.sabor || item.nome || item.nomeProduto || '-',
            }))
          : [];
        setItens(itensNormalizados);
      } catch {
        setItens([]);
      }
    };
    fetchCarrinho();
  }, [clienteId]);

  const adicionar = async (pizza: { pizzaId: number; sabor: string; preco: number }) => {
    if (!clienteId) return;
    const existente = itens.find(i => i.pizzaId === pizza.pizzaId);
    if (existente) {
      // Atualiza quantidade de um item já existente
      await apiRequest('/carrinho', {
        method: 'PUT',
        body: JSON.stringify({ id: existente.id, quantidade: existente.quantidade + 1 })
      });
    } else {
      // Adiciona novo item ao carrinho (payload alinhado ao backend)
      await apiRequest('/carrinho', {
        method: 'POST',
        body: JSON.stringify({
          cliente: { id: clienteId },
          pizza: { id: pizza.pizzaId },
          quantidade: 1,
          preco: pizza.preco,
          nomeProduto: pizza.sabor
        })
      });
    }
    const data = await apiRequest(`/carrinho?clienteId=${clienteId}`);
    setItens(Array.isArray(data) ? data : []);
  };

  const remover = async (id: number) => {
    if (!clienteId) return;
    try {
      await apiRequest(`/carrinho/${id}`, { method: 'DELETE' });
    } catch (e: any) {
      // Só lança erro se não for 404
      if (!e || (e.status && e.status !== 404)) throw e;
    }
    const data = await apiRequest(`/carrinho?clienteId=${clienteId}`);
    setItens(Array.isArray(data) ? data : []);
  };

  const alterarQuantidade = async (id: number, quantidade: number) => {
    if (!clienteId) return;
    const item = itens.find(i => i.id === id);
    if (!item) return;
    await apiRequest('/carrinho', {
      method: 'PUT',
      body: JSON.stringify({ id: item.id, quantidade })
    });
    const data = await apiRequest(`/carrinho?clienteId=${clienteId}`);
    setItens(Array.isArray(data) ? data : []);
  };

  const limpar = async () => {
    if (!clienteId) return;
    for (const item of itens) {
      await apiRequest(`/carrinho/${item.id}`, { method: 'DELETE' });
    }
    setItens([]);
  };

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, remover, alterarQuantidade, limpar }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error('useCarrinho deve ser usado dentro do CarrinhoProvider');
  return ctx;
};
