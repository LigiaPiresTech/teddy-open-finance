import React from 'react';
import { AppRoutes } from './routes';
import '../index.css'; // Carrega os estilos globais e o Tailwind CSS

/**
 * Componente Raiz do Front-End (Teddy Open Finance)
 * Responsável por injetar o ecossistema de rotas e configurações globais.
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      {/* Renderiza o gerenciador de navegação mapeado no arquivo routes.tsx */}
      <AppRoutes />
    </div>
  );
}

export default App;