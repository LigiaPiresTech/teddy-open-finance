import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Componente: Button', () => {
  it('deve renderizar o texto do botão corretamente', () => {
    render(<Button>Entrar</Button>);
    
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('deve chamar a função onClick quando for clicado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Enviar</Button>);
    
    const botao = screen.getByText('Enviar');
    fireEvent.click(botao);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar o texto de carregamento e desativar o clique quando isLoading for true', () => {
    const handleClick = vi.fn();
    render(<Button isLoading={true} onClick={handleClick}>Salvar</Button>);
    
    const botao = screen.getByRole('button');
    
    expect(screen.getByText('A carregar...')).toBeInTheDocument();
    expect(botao).toBeDisabled();
    
    fireEvent.click(botao);
    expect(handleClick).not.toHaveBeenCalled();
  });
});