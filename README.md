# FrontEnd PizzariaD

Interface web construída em React + TypeScript para gerenciamento de uma pizzaria. O sistema permite que usuários autenticados visualizem, editem e gerenciem pizzas, ingredientes e cardápios de forma prática.

## Tecnologias

- React
- TypeScript
- Vite
- Bootstrap
- JWT (JSON Web Token)
- Axios (em breve)

## Pré-requisitos

Antes de começar, você vai precisar ter instalado:

- Node.js (recomendado: v18+)
- npm (ou yarn)

## Instalação

Clone o repositório e instale as dependências:

git clone https://github.com/douglaszago/frontend.git
cd frontend
npm install
npm run dev
Acesse: http://localhost:5173

Scripts disponíveis
npm run dev — Inicia o servidor de desenvolvimento com Vite

npm run build — Gera o build para produção

npm run preview — Visualiza o build como será servido em produção

Estrutura do Projeto
bash
Copiar
Editar
src/

├── components/       # Componentes reutilizáveis (ex: ProtectedRoute)

├── pages/            # Páginas principais (Login, Pizzas, Ingredientes, Cardápio)

├── App.tsx           # Definições de rotas e navegação

└── main.tsx          # Ponto de entrada da aplicação

Autenticação e Rotas Protegidas
O login armazena um token JWT no localStorage.

As rotas protegidas verificam a presença do token antes de permitir acesso.

Se o token não existir ou for inválido, o usuário é redirecionado para a tela de login.

Estilização
A estilização foi feita com Bootstrap, permitindo uma interface responsiva e com boa usabilidade desde o início.

Integração com API
A aplicação se conecta a uma API externa (em desenvolvimento).

A biblioteca axios será utilizada para requisições HTTP.

Endpoints de login, pizzas, ingredientes e cardápio serão consumidos.

Roadmap
 Layout básico com React + TypeScript

 Navegação com React Router

 Autenticação com JWT

 Sistema de rotas protegidas

 Integração com API usando axios

 Validações de formulário

 Upload de imagens de pizzas

 Testes unitários

Contribuição
Contribuições são bem-vindas.

Fork o projeto

Crie sua branch (git checkout -b feature/nova-funcionalidade)

Commit suas mudanças (git commit -m 'feat: nova funcionalidade')

Push para a branch (git push origin feature/nova-funcionalidade)

Abra um Pull Request

Licença
Este projeto está licenciado sob a licença MIT.
© 2025 - Douglas Zago
