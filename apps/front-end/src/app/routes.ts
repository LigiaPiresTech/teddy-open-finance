import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../features/auth/pages/Login';
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { ClientList } from '../features/clients/pages/ClientList';

// =============================================================================
// COMPONENTE DE PROTEÇÃO DE ROTA (GUARD)
// =============================================================================
// Garante que apenas usuários autenticados (com token válido) acessem o sistema
interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Busca o token JWT que salvámos no fluxo de Login
  const token = localStorage.getItem('@TeddyOpenFinance:token');

  // Se tiver token, renderiza a página. Se não, barra o acesso e manda para o Login.
  return token ? children : <Navigate to="/" replace />;
};

// =============================================================================
// MAPEAMENTO DE ROTAS DA APLICAÇÃO
// =============================================================================
export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública: Tela Inicial de Autenticação */}
        <Route path="/" element={<Login />} />

        {/* Rota Protegida: Painel do Dashboard com Gráficos e Indicadores */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Rota Protegida: Listagem de Clientes e Contador de Acessos */}
        <Route 
          path="/clientes" 
          element={
            <PrivateRoute>
              <ClientList />
            </PrivateRoute>
          } 
        />

        {/* Rota de Escape: Qualquer link inválido ou inexistente joga para o Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};