import React from 'react';

interface LoginCardProps {
  onSubmit: (e: React.FormEvent) => void;
  emailValue: string;
  onEmailChange: (value: string) => void;
  senhaValue: string;
  onSenhaChange: (value: string) => void;
  erroMensagem?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  onSubmit,
  emailValue,
  onEmailChange,
  senhaValue,
  onSenhaChange,
  erroMensagem
}) => {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-gray-100">
      {/* Cabeçalho do Card */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Teddy Open Finance
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Aceda à plataforma de gestão de clientes
        </p>
      </div>
      
      {/* Mensagem de Erro com Alerta Visual */}
      {erroMensagem && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-fade-in">
          <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{erroMensagem}</span>
        </div>
      )}
      
      {/* Formulário */}
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            E-mail / Login
          </label>
          <input 
            type="text" 
            value={emailValue}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="introduza o seu e-mail"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Senha
          </label>
          <input 
            type="password" 
            value={senhaValue}
            onChange={(e) => onSenhaChange(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.98]"
        >
          Entrar na Conta
        </button>
      </form>
    </div>
  );
};