import React, { useState } from 'react';
import { api } from '../../shared/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { login: email, senha_hash: senha });
      localStorage.setItem('@TeddyOpenFinance:token', response.data.token);
      window.location.href = '/dashboard'; // Redireciona para o Dashboard pós-login
    } catch (err) {
      setErro('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Teddy Open Finance</h2>
        
        {erro && <p className="mb-4 text-sm text-red-500 bg-red-50 p-2 rounded">{erro}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">E-mail / Login</label>
          <input 
            type="text" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input 
            type="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <button type="submit" className="w-full rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700 transition">
          Entrar
        </button>
      </form>
    </div>
  );
};