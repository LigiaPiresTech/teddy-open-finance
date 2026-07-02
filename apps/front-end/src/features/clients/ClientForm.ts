import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../shared/api/api';

export const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Se houver ID na URL, significa que estamos em modo de EDIÇÃO
  const isEditMode = Boolean(id);

  // Estados do Formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [tipoCliente, setTipoCliente] = useState('PF'); // 'PF' ou 'PJ'
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [rendaMensal, setRendaMensal] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Se for modo de Edição, busca os dados atuais do cliente no Back-End
  useEffect(() => {
    if (isEditMode && id) {
      setCarregando(true);
      api.get(`/clients/${id}`)
        .then((res) => {
          const c = res.data;
          setNomeCompleto(c.nomeCompleto);
          setCpfCnpj(c.cpfCnpj);
          setTipoCliente(c.tipoCliente);
          setEmail(c.email || '');
          setTelefone(c.telefone || '');
          setRendaMensal(c.rendaMensal ? String(c.rendaMensal) : '');
        })
        .catch(() => setErro('Erro ao carregar dados do cliente.'))
        .finally(() => setCarregando(false));
    }
  }, [isEditMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    // Validações simples de fronteira
    if (!nomeCompleto || !cpfCnpj) {
      setErro('Nome Completo e CPF/CNPJ são campos obrigatórios.');
      return;
    }

    const payload = {
      nomeCompleto,
      cpfCnpj,
      tipoCliente,
      email: email || undefined,
      telefone: telefone || undefined,
      rendaMensal: rendaMensal ? parseFloat(rendaMensal) : undefined,
    };

    try {
      if (isEditMode) {
        await api.put(`/clients/${id}`, payload);
      } else {
        await api.post('/clients', payload);
      }
      navigate('/clientes'); // Retorna para a listagem após o sucesso
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Ocorreu um erro ao salvar o cliente. Verifique os dados.');
    }
  };

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 font-medium">A carregar dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Cabeçalho dinâmico */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? '⚙️ Editar Cliente' : '✨ Cadastrar Novo Cliente'}
        </h2>
        <button 
          onClick={() => navigate('/clientes')}
          className="text-sm font-semibold text-gray-600 hover:text-gray-800"
        >
          Voltar para a lista
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 space-y-6">
        {erro && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 font-medium border border-red-100">
            {erro}
          </div>
        )}

        {/* Nome Completo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo / Razão Social *</label>
          <input 
            type="text"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            placeholder="Ex: João Silva ou Teddy Open Finance LTDA"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Cliente */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Perfil</label>
            <select
              value={tipoCliente}
              onChange={(e) => setTipoCliente(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="PF">Pessoa Física (CPF)</option>
              <option value="PJ">Pessoa Jurídica (CNPJ)</option>
            </select>
          </div>

          {/* CPF / CNPJ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {tipoCliente === 'PF' ? 'CPF *' : 'CNPJ *'}
            </label>
            <input 
              type="text"
              value={cpfCnpj}
              maxLength={tipoCliente === 'PF' ? 11 : 14}
              onChange={(e) => setCpfCnpj(e.target.value.replace(/\D/g, ''))} // Apenas números
              placeholder={tipoCliente === 'PF' ? 'Apenas os 11 números' : 'Apenas os 14 números'}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail Corporativo / Pessoal</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cliente@dominio.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone de Contacto</label>
            <input 
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Ex: 11999998888"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Renda Mensal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Renda Mensal / Faturamento (BRL)</label>
            <input 
              type="number"
              step="0.01"
              value={rendaMensal}
              onChange={(e) => setRendaMensal(e.target.value)}
              placeholder="Ex: 4500.00"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Ações de Submissão */}
        <div className="flex gap-3 justify-end border-t pt-4">
          <button
            type="button"
            onClick={() => navigate('/clientes')}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
          >
            {isEditMode ? 'Salvar Alterações' : 'Concluir Cadastro'}
          </button>
        </div>
      </form>
    </div>
  );
};