# 🦁 Teddy Open Finance - Desafio Técnico Sênior

Este repositório contém a solução do desafio técnico para a vaga de Desenvolvedor Sênior. A aplicação consiste em um sistema completo de gestão e auditoria de clientes, composto por uma API robusta em **NestJS** no Back-End e uma interface SPA moderna e responsiva em **React (Vite)** no Front-End.

O projeto foi inteiramente modularizado e conteinerizado, adotando padrões rígidos de qualidade, testes automatizados e observabilidade de nível corporativo.

---

## 🛠️ Tecnologias Utilizadas e Arquitetura

A arquitetura foi desenhada para garantir isolamento de ambientes, facilidade de escala e alta performance local por meio do Docker.

### Back-End (API)
* **NestJS:** Framework opinativo para Node.js, utilizando arquitetura modular.
* **TypeORM + PostgreSQL:** Camada de persistência relacional com migrações automáticas e auditoria nativa.
* **JWT (JSON Web Token):** Autenticação stateless com criptografia `bcrypt` para senhas.
* **Class-Validator:** Validação estrita de payloads de entrada na borda da aplicação.
* **Swagger (OpenAPI):** Documentação interativa de endpoints disponível em tempo de execução.

### Front-End (SPA)
* **React + TypeScript:** Interface fortemente tipada e componentizada.
* **Vite:** Ferramenta de build ultra-rápida.
* **Tailwind CSS:** Estilização utilitária e totalmente responsiva.
* **React Router Dom:** Gerenciamento de rotas públicas e privadas.
* **Axios:** Cliente HTTP com interceptores globais para injeção automática do Token JWT.

---

## ☁️ Fluxo e Arquitetura da Rede Local

Toda a infraestrutura se comunica dentro de uma rede virtual isolada via Docker (`bridge`). O fluxo de conexões opera da seguinte forma: