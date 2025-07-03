import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PizzasPage from './pages/PizzasPage';
import IngredientesPage from './pages/IngredientesPage';
import CardapioPage from './pages/CardapioPage';
import CarrinhoPage from './pages/CarrinhoPage';
import PagamentoPage from './pages/PagamentoPage';
import PedidosPage from './pages/PedidosPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CarrinhoProvider } from './components/CarrinhoContext';
import CadastroClientePage from './pages/CadastroClientePage';

function App() {
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp && Date.now() / 1000 > payload.exp) {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        } catch (e) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  return (
    <CarrinhoProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pizzas" element={<ProtectedRoute><PizzasPage /></ProtectedRoute>} />
          <Route path="/ingredientes" element={<ProtectedRoute><IngredientesPage /></ProtectedRoute>} />
          <Route path="/cardapio" element={<ProtectedRoute><CardapioPage /></ProtectedRoute>} />
          <Route path="/carrinho" element={<ProtectedRoute><CarrinhoPage /></ProtectedRoute>} />
          <Route path="/pagamento" element={<ProtectedRoute><PagamentoPage /></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute><PedidosPage /></ProtectedRoute>} />
          <Route path="/cadastro-cliente" element={<CadastroClientePage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </CarrinhoProvider>
  );
}

export default App;
