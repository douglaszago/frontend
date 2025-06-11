# Copilot Instructions for FrontEndPizzariaD

## Objetivo

Este projeto utiliza React + TypeScript para consumir a API da pizzaria, com autenticação JWT, navegação protegida e páginas separadas para pizzas, ingredientes e cardápio.

## Convenções

- Use Bootstrap para estilização.
- Utilize `axios` para requisições HTTP.
- O token JWT deve ser salvo em `localStorage` após login.
- Rotas protegidas devem redirecionar para `/login` se não houver token.
- Separe páginas em `src/pages/` e componentes reutilizáveis em `src/components/`.
- Use React Router para navegação.

## Estrutura sugerida

- `src/App.tsx` — define as rotas.
- `src/pages/LoginPage.tsx` — página de login.
- `src/pages/PizzasPage.tsx` — listagem de pizzas.
- `src/pages/IngredientesPage.tsx` — listagem de ingredientes.
- `src/pages/CardapioPage.tsx` — listagem do cardápio.
- `src/components/ProtectedRoute.tsx` — wrapper para rotas protegidas.

## Testes

- O front-end deve ser testado manualmente acessando as rotas e verificando a navegação protegida.

---

Siga estas instruções para manter o padrão do projeto.
