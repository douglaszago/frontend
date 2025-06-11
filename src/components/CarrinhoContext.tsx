import React, { createContext, useContext, useState } from 'react';

export interface CarrinhoItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

interface CarrinhoContextType {
  itens: CarrinhoItem[];
  adicionar: (item: Omit<CarrinhoItem, 'quantidade'>) => void;
  remover: (id: number) => void;
  alterarQuantidade: (id: number, quantidade: number) => void;
  limpar: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);

  const adicionar = (item: Omit<CarrinhoItem, 'quantidade'>) => {
    setItens((prev) => {
      const existente = prev.find(i => i.id === item.id);
      if (existente) {
        return prev.map(i => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  };

  const remover = (id: number) => {
    setItens((prev) => prev.filter(i => i.id !== id));
  };

  const alterarQuantidade = (id: number, quantidade: number) => {
    setItens((prev) => prev.map(i => i.id === id ? { ...i, quantidade } : i));
  };

  const limpar = () => setItens([]);

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
