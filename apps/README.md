# Teddy Open Finance - Documentação de Engenharia & Arquitetura

Este repositório apresenta uma solução de nível corporativo para o gerenciamento, monitoramento e auditoria de clientes. O ecossistema foi projetado sob o padrão de **Monorepo**, isolando as camadas de negócios e apresentação em microsserviços/aplicações independentes (`apps/`), garantindo desacoplamento, robustez e alta performance.

---

## 1. Mapeamento Estrito dos Requisitos do Desafio

Esta aplicação atende a 100% dos critérios obrigatórios e diferenciais exigidos no escopo técnico:

### Back-End (NestJS)
* **`POST /auth/login`**: Endpoint público de autenticação. Realiza a validação de credenciais utilizando criptografia asssimétrica com `bcrypt` para comparação de hashes e emite um token **JWT (JSON Web Token)** assinado e temporizado.
* **`POST /clients`**: Criação de clientes protegida por guardas de rota JWT (`JwtAuthGuard`). Possui camada de validação sintática e semântica de payloads na borda via `class-validator`, impedindo a inserção de CPFs ou CNJPs duplicados ou inválidos.
* **`GET /clients`**: Listagem geral de clientes ativos. Implementa automaticamente um filtro global para ignorar registros que sofreram exclusão lógica (*Soft Delete*).
* **`GET /clients/:id`**: Detalhamento técnico da ficha do cliente. Este endpoint executa uma **operação atômica de incremento** no banco de dados (`contadorAcessos = contadorAcessos + 1`) antes de retornar o payload, garantindo a auditoria de acessos sem concorrência de concorrência de dados.
* **`PUT /clients/:id`**: Atualização parcial/total de dados cadastrais com controle de timestamps (`updatedAt`).
* **`DELETE /clients/:id`**: Implementação nativa de **Soft Delete**. O registro não é expurgado fisicamente da tabela; em vez disso, o campo `deletedAt` é populado com o timestamp da ação, preservando o histórico auditável do ecossistema.

### Front-End (React + Vite + TypeScript)
* **Fluxo de Autenticação**: Tela de Login integrada a um contexto de segurança (`AuthContext`). Se o token JWT não estiver presente ou estiver expirado no `localStorage`, interceptores do `Axios` barram a navegação e forçam o redirecionamento automático para a rota pública `/login`.
* **Dashboard Analítico**: Centraliza três componentes estratégicos consumindo a API de forma assíncrona:
  * **Cards de Métricas**: Indicadores de volume total de clientes ativos e média de faturamento/renda ponderada.
  * **Gráficos Dinâmicos**: Plotagem visual responsiva da distribuição e evolução cadastral de clientes.
  * **Módulo de Inclusões Recentes**: Uma tabela de rastreamento rápido exibindo os últimos 5 clientes inseridos no sistema.
* **Módulo CRUD Completo de Clientes**: Interfaces reativas para Listar (com paginação), Criar, Editar (reutilização de formulários dinâmicos com preenchimento via estado), Excluir (acionamento de modal de confirmação antes do disparo do *Soft Delete*) e Detalhes (exibindo o contador de acessos incrementado em tempo real).

---

## 2. Observabilidade de Nível de Produção (Production-Ready)

A engenharia do sistema foi concebida focando na resiliência operacional. A observabilidade permite que o time de SRE/Infraestrutura mitigue incidentes rapidamente baseado em três pilares:

### I. Logs Estruturados em formato JSON
Substituindo os logs convencionais em formato de texto livre (strings), a API utiliza um Logger customizado (baseado em `Winston/Pino`) que formata todas as saídas do terminal em objetos JSON estruturados.
* **Por que isso é vital?** Ferramentas de agregação e ingestão de telemetria (como *Grafana Loki*, *Datadog* ou *AWS CloudWatch Logs Insights*) conseguem quebrar, indexar e pesquisar propriedades do JSON (como `statusCode`, `executionTime`, `userId` ou `context`) em milissegundos dentro de terabytes de dados, acelerando o MTTR (*Mean Time to Repair*).

### II. Endpoint de Diagnóstico de Saúde (`/healthz`)
Integrado ao framework através do módulo `@nestjs/terminus`, este endpoint executa sondagens de integridade (*Health Checks*) em tempo real. Ele verifica não apenas se o servidor HTTP está de pé, mas também testa a conectividade e a latência de escrita/leitura com o banco de dados PostgreSQL.
* **Por que isso é vital?** Orquestradores de containers utilizam essa rota como *Liveness e Readiness Probes*. Se o banco de dados falhar, o endpoint responde com `503 Service Unavailable`, sinalizando para a infraestrutura interromper o direcionamento de tráfego para aquele container específico e reiniciá-lo de forma automatizada.

### III. Telemetria e Métricas no Padrão Prometheus (`/metrics`)
A API expõe dados brutos de performance coletados através do ecossistema `prom-client` formatados sob a especificação oficial do Prometheus.
* **Por que isso é vital?** O servidor do Prometheus realiza raspagens (*scraping*) contínuas dessa rota, coletando métricas críticas do Node.js (como uso de Heap de memória RAM, saturação de CPU, lag do *Event Loop* e taxa de requisições por segundo). Esses dados alimentam dashboards em tempo real no **Grafana** e disparam alarmes automáticos em canais de comunicação antes que uma degradação de performance afete o usuário final.

---

## 3. Arquitetura do Monorepo (Orquestração Nx.dev)

O projeto adota a arquitetura de **Monorepo Integrado** gerenciado pelo **Nx**, centralizando a governança e o ferramental de qualidade sem fragmentar o histórico do Git.

teddy-open-finance/ (Raiz do Projeto)
├── .github/workflows/    <-- Pipelines de CI/CD Isolados (GitHub Actions)

├── apps/

│   ├── back-end/         <-- API RESTful (NestJS, TypeORM, Jest)

│   └── front-end/        <-- SPA Interface (React, Vite, Tailwind, Vitest)

├── libs/                 <-- Código, contratos e tipos compartilhados

├── nx.json               <-- Grafo de dependências e regras de cache do Nx

├── package.json          <-- Gerenciamento global de dependências

└── README.md             <-- Documentação técnica de arquitetura
├── package.json          <-- Gerenciamento global de dependências
└── README.md             <-- Documentação técnica de arquitetura
