import React, { InputHTMLAttributes, forwardRef } from 'react';

// Propriedades customizadas para o componente de Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    // Gera um ID único caso não seja passado, garantindo a acessibilidade do Label
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full flex flex-col gap-1.5">
        {/* Label do Input */}
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-semibold text-gray-700 select-none"
          >
            {label}
          </label>
        )}

        {/* Campo de Entrada de Texto */}
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full rounded-lg border px-4 py-2.5 text-sm transition 
            focus:outline-none focus:ring-2 
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-100' 
              : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-100'
            } 
            ${className}
          `}
          {...props}
        />

        {/* Mensagem de Erro com efeito visual */}
        {error && (
          <p className="text-xs font-medium text-red-600 flex items-center gap-1 animate-fade-in">
            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Define um nome de exibição para facilitar a depuração no React DevTools
Input.displayName = 'Input';