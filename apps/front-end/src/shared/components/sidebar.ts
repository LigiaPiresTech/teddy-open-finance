import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // Função para deslogar o usuário e limpar a sessão
  const handleLogout = () => {
    localStorage.removeItem('@TeddyOpenFinance:token');
    navigate('/');
  };

  // Estilização padrão para os links do menu (Ativo vs Inativo)
  const linkStyle = ({ isActive }: { isActive: boolean }) => `
    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200
    ${isActive 
      ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }
  `;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col justify-between p-4 z-40">
      
      {/* Bloco Superior: Logo e Navegação */}
      <div className="flex flex-col gap-8">
        {/* Identificação do Projeto */}
        <div className="px-2 py-3 border-b border-gray-100">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Teddy <span className="text-blue-600 font-medium text-xs uppercase tracking-widest block mt-0.5">Open Finance</span>
          </h1>
        </div>

        {/* Links de Navegação */}
        <nav className="flex flex-col gap-1">
          <NavLink to="/dashboard" className={linkStyle}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2