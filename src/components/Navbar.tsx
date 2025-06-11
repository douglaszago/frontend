import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  if (!isLoggedIn) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/cardapio">PizzariaD</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/cardapio' ? ' active' : ''}`} to="/cardapio">Cardápio</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/pizzas' ? ' active' : ''}`} to="/pizzas">Pizzas</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/ingredientes' ? ' active' : ''}`} to="/ingredientes">Ingredientes</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/carrinho' ? ' active' : ''}`} to="/carrinho">Carrinho</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/pagamento' ? ' active' : ''}`} to="/pagamento">Pagamento</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/pedidos' ? ' active' : ''}`} to="/pedidos">Meus Pedidos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/pizzas' ? ' active' : ''}`} to="/pizzas">Cadastro de Pizza</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="btn btn-outline-light btn-sm" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
