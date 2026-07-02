import React from 'react';

interface Client {
  id: number;
  nomeCompleto: string;
  cpfCnpj: string;
  tipoCliente: string;
  email?: string;
  telefone?: string;
  rendaMensal?: number;
  contadorAcessos: number;
}

interface ClientModalProps {
  isOpen: boolean;
  cliente: Client | null;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, cliente, onClose }) => {
  // Se o modal não estiver aberto ou não houver cliente selecionado, não renderiza nada
  if (!isOpen || !cliente) return null;

  // Função auxiliar para formatar valores monetários em Real (BRL)
  const formatarMoeda = (valor?: number) => {
    if (!valor) return 'Não informada';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end transition-opacity">
      {/* Container do Modal com animação de deslizar da direita */}
      <div className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-slide-in">
        
        <div>
          {/* Cabeçalho do Modal */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900">Ficha do Cliente</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Dados do Cliente */}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Nome Completo</label>
              <p className="text-sm font-medium text-gray-800 mt-1">{cliente.nomeCompleto}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Documento</label>
                <p className="text-sm font-medium text-gray-800 mt-1">{cliente.cpfCnpj}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Tipo de Perfil</label>
                <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${
                  cliente.tipoCliente === 'PF' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  Pessoa {cliente.tipoCliente === 'PF' ? 'Física' : 'Jurídica'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">E-mail de Contacto</label>
              <p className="text-sm font-medium text-gray-800 mt-1">{cliente.email || 'Não informado'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Telefone</label>
                <p className="text-sm font-medium text-gray-800 mt-1">{cliente.telefone || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Renda Mensal</label>
                <p className="text-sm font-medium text-gray-800 mt-1">{formatarMoeda(cliente.rendaMensal)}</p>
              </div>
            </div>

            {/* REQUISITO DE AUDITORIA / MÉTRICAS EXIGIDO NO DESAFIO */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 mt-6 flex gap-3 items-start">
              <svg className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold">Indicador de Telemetria</p>
                <p className="mt-1 opacity-90">
                  Este perfil já foi consultado e visualizado por operadores um total de <strong className="text-base font-extrabold">{cliente.contadorAcessos} vezes</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Fechar na base */}
        <button 
          onClick={onClose} 
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition text-sm mt-6"
        >
          Fechar Visualização
        </button>

      </div>
    </div>
  );
};