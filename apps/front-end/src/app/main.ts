import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css'; // Garante que o Tailwind CSS seja injetado no topo da aplicação

/**
 * Ponto de Entrada Principal (Vite + React + TypeScript)
 * Renderiza a árvore de componentes da aplicação Teddy Open Finance dentro da DOM.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Renderiza o core do nosso Front-end com as rotas e guards acoplados */}
    <App />
  </React.StrictMode>
);