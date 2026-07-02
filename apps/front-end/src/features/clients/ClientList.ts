import React, { useEffect, useState } from 'react';
import { api } from '../../shared/api';

export const ClientList: React.FC = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteFocado, setClienteFocado] = useState<any>(null);

  const carregarClientes = () => {
    api.get('/clients').then((res) => setClientes(res.data));
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleSoftDelete = async (id: number) => {
    if (confirm('Tem certeza de que deseja inativar este cliente?')) {
      await api.delete(`/clients/${id}`);
      carregarClientes(); // Recarrega a tabela limpa pós-exclusão
    }
  };

  const handleVerDetalhes = async (id: number) => {
    // Ao chamar esse endpoint, o Back-End adiciona automaticamente +1 no contador de acessos
    const res = await api.get(`/clients/${id}`);
    setClienteFocado(res.data);
    carregarClientes(); // Atualiza a contagem na tabela em plano de fundo
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Clientes</h2>
        <a href="/clients/novo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium text-sm">
          + Novo Cliente
        </a>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold">
              <th className="p-4">Nome Completo</th>
              <th className="p-4">CPF / CNPJ</th>
              <th className="p-4">Tipo</th>
              <th className="p-4 text-center">Visualizações (Métricas)</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
            {clientes.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{c.nomeCompleto}</td>
                <td className="p-4">{c.cpfCnpj}</td>
                <td className="p-4">{c.tipoCliente}</td>
                <td className="p-4 text-center">
                  <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-semibold">{c.contadorAcessos}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleVerDetalhes(c.id)} className="text-blue-600 hover:underline">Ver</button>
                  <button onClick={() => handleSoftDelete(c.id)} className="text-red-600 hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Lateral de Detalhes com o Contador Atômico */}
      {clienteFocado && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Ficha do Cliente</h3>
              <div className="space-y-4">
                <p><strong>Nome:</strong> {clienteFocado.nomeCompleto}</p>
                <p><strong>Documento:</strong> {clienteFocado.cpfCnpj}</p>
                <p><strong>Tipo:</strong> {clienteFocado.tipoCliente}</p>
                <p><strong>E-mail:</strong> {clienteFocado.email || 'Não informado'}</p>
                <div className="bg-blue-50 p-4 rounded text-blue-800 text-sm">
                  ⚠️ Este perfil já foi visualizado <strong>{clienteFocado.contadorAcessos} vezes</strong> por operadores.
                </div>
              </div>
            </div>
            <button onClick={() => setClienteFocado(null)} className="w-full border p-2 rounded text-gray-600 hover:bg-gray-50 font-medium">
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
};