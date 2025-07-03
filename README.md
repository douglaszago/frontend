# FrontEnd PizzariaD

Este projeto é um front-end React + TypeScript para consumir a API da pizzaria, com autenticação JWT, navegação protegida e páginas para pizzas, ingredientes e cardápio.

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — preview do build

## Estrutura

- `src/pages/` — páginas principais (Login, Pizzas, Ingredientes, Cardápio)
- `src/components/` — componentes reutilizáveis (ex: ProtectedRoute)
- `src/App.tsx` — rotas e navegação

## Autenticação

O login armazena o token JWT no `localStorage`. As rotas protegidas só são acessíveis se o token estiver presente.

## Estilo

Bootstrap é utilizado para estilização rápida e responsiva.

## Integração

A integração com a API é feita via `axios` (implementar em breve).

---

Para rodar:

```bash
npm install
npm run dev
```

Abra http://localhost:5173
