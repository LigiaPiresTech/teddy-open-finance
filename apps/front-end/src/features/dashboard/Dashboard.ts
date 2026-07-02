import React, { useEffect, useState } from 'react';
import { api } from '../../shared/api';

export const Dashboard: React.FC = () => {
  const [totais, setTotais] = useState({ pf: 0, pj: 0, total: 0 });
  const [ultimosClientes, setUltimosClientes] = useState([]);

  useEffect(() => {
    // Carrega os dados simulando os agregadores do Dashboard exigidos no MVP
    api.get('/clients').then((res) => {
      const dados = res.data;
      const pf = dados.filter((c: any) => c.tipoCliente === 'PF').length;
      const pj = dados.filter((c: any) => c.tipoCliente === 'PJ').length;
      
      setTotais({ pf, pj, total: dados.length });
      setUltimosClientes(dados.slice(-3).reverse()); // Pega os 3 últimos adicionados
    });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Administrativo</h1>
      
      {/* Cards Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium">Total de Clientes</p>
          <p className="text-2xl font-bold text-gray-800">{totais.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Pessoas Físicas (PF)</p>
          <p className="text-2xl font-bold text-gray-800">{totais.pf}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm font-medium">Pessoas Jurídicas (PJ)</p>
          <p className="text-2xl font-bold text-gray-800">{totais.pj}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Simples Customizado em CSS */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Proporção da Carteira</h3>
          <div className="flex items-end h-40 space-x-4 justify-around pt-4">
            <div className="w-16 bg-green-500 rounded-t text-center text-white text-xs py-1" style={{ height: `${totais.total ? (totais.pf / totais.total) * 100 : 0}%` }}>PF</div>
            <div className="w-16 bg-purple-500 rounded-t text-center text-white text-xs py-1" style={{ height: `${totais.total ? (totais.pj / totais.total) * 100 : 0}%` }}>PJ</div>
          </div>
        </div>

        {/* Últimos Clientes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Últimos Clientes Cadastrados</h3>
          <ul className="divide-y divide-gray-200">
            {ultimosClientes.map((cliente: any) => (
              <li key={cliente.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{cliente.nomeCompleto}</p>
                  <p className="text-xs text-gray-500">{cliente.cpfCnpj}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${cliente.tipoCliente === 'PF' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                  {cliente.tipoCliente}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};