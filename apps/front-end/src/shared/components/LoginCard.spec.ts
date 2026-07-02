import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginCard } from './LoginCard';

describe('Componente: LoginCard', () => {
  const mockProps = {
    onSubmit: vi.fn((e) => e.preventDefault()),
    emailValue: '',
    onEmailChange: vi.fn(),
    senhaValue: '',
    onSenhaChange: vi.fn(),
  };

  it('deve renderizar os campos de input e o botão', () => {
    render(<LoginCard {...mockProps} />);
    
    expect(screen.getByLabelText(/E-mail \/ Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar na Conta/i })).toBeInTheDocument();
  });

  it('deve exibir a mensagem de erro quando ela for fornecida', () => {
    render(<LoginCard {...mockProps} erroMensagem="Credenciais inválidas" />);
    
    expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
  });

  it('deve disparar os eventos de mudança ao digitar nos inputs', () => {
    render(<LoginCard {...mockProps} />);
    
    const inputEmail = screen.getByPlaceholderText('introduza o seu e-mail');
    fireEvent.change(inputEmail, { target: { value: 'admin@teddy.com' } });
    
    expect(mockProps.onEmailChange).toHaveBeenCalledWith('admin@teddy.com');
  });
});