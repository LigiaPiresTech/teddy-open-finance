# Teddy Open Finance - Documentação de Engenharia & Arquitetura

Este repositório apresenta uma solução de nível corporativo para o gerenciamento, monitoramento e auditoria de clientes. O ecossistema foi projetado sob o padrão de **Monorepo**, isolando as camadas de negócios e apresentação em microsserviços/aplicações independentes (`apps/`), garantindo desacoplamento, robustez e alta performance.

---

## 1. Mapeamento Estrito dos Requisitos do Desafio

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



## 4. Manual Passo a Passo de Arquitetura e Deploy na AWS

Para mover esta aplicação da visão local para um ambiente de produção resiliente, escalável e seguro na nuvem da **Amazon Web Services (AWS)**, deve-se seguir a arquitetura de referência descrita abaixo:

### Desenho da Infraestrutura Recomendada na AWS

* **Camada de Rede**: Criação de uma VPC personalizada dividida em Subnets Públicas (para os balanceadores de carga) e Subnets Privadas (para a API e Bancos de Dados, isolados da internet pública).
* **Camada de Computação**: **AWS ECS (Elastic Container Service)** rodando sobre **AWS Fargate** (Serverless), eliminando a necessidade de gerenciar sistemas operacionais de instâncias EC2.
* **Camada de Dados**: **Amazon RDS PostgreSQL** configurado em Multi-AZ para alta disponibilidade, e **Amazon ElastiCache for Redis** para cacheamento de sessões e rate-limiting.


### Guia de Configuração Passo a Passo na AWS

#### Passo 1: Conteinerização e Publicação das Imagens (AWS ECR)

Antes de subir os serviços, as aplicações precisam virar imagens Docker guardadas no **AWS ECR (Elastic Container Registry)**.

1. Crie dois repositórios no AWS ECR: um chamado `teddy-backend` e outro chamado `teddy-frontend`.
2. Autentique seu Docker local na AWS:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <id_da_sua_conta_aws>.dkr.ecr.us-east-1.amazonaws.com

```


3. Realize o Build e o Push das imagens:
```bash
# Back-End
docker build -t teddy-backend ./apps/back-end
docker tag teddy-backend:latest <id_da_sua_conta_aws>[.dkr.ecr.us-east-1.amazonaws.com/teddy-backend:latest](https://.dkr.ecr.us-east-1.amazonaws.com/teddy-backend:latest)
docker push <id_da_sua_conta_aws>[.dkr.ecr.us-east-1.amazonaws.com/teddy-backend:latest](https://.dkr.ecr.us-east-1.amazonaws.com/teddy-backend:latest)

# Front-End
docker build -t teddy-frontend ./apps/front-end
docker tag teddy-frontend:latest <id_da_sua_conta_aws>[.dkr.ecr.us-east-1.amazonaws.com/teddy-frontend:latest](https://.dkr.ecr.us-east-1.amazonaws.com/teddy-frontend:latest)
docker push <id_da_sua_conta_aws>[.dkr.ecr.us-east-1.amazonaws.com/teddy-frontend:latest](https://.dkr.ecr.us-east-1.amazonaws.com/teddy-frontend:latest)

```

#### Passo 2: Provisionamento do Banco de Dados (Amazon RDS)

1. Acesse o console do **Amazon RDS** e clique em **Create Database**.
2. Selecione o **PostgreSQL** (versão 15 ou superior).
3. No nível de disponibilidade, selecione **Production** (Ativa a replicação Multi-AZ automática em zonas de disponibilidade diferentes para evitar quedas).
4. Em **Connectivity**, certifique-se de associar o RDS às **Subnets Privadas** da sua VPC e crie um Security Group que permita tráfego de entrada na porta `5432` vindo **apenas** do Security Group que será usado pela API.

#### Passo 3: Criação do Cluster e Serviços Computacionais (AWS ECS + Fargate)

1. Acesse o **AWS ECS** e crie um cluster chamado `teddy-cluster`.
2. **Task Definition do Back-End**:
* Crie uma Task Definition selecionando o tipo **Fargate**.
* Defina o tamanho da task (ex: 0.5 vCPU e 1GB RAM).
* Adicione o container apontando para a URI da sua imagem no ECR (`teddy-backend:latest`).
* Configure as variáveis de ambiente com segurança utilizando o **AWS Systems Manager Parameter Store** ou **AWS Secrets Manager** para injetar segredos como `DATABASE_URL` e `JWT_SECRET`.
* Mapeie a porta do container para a porta `3000`.


3. **Task Definition do Front-End**:
* Siga o mesmo processo, apontando para a imagem `teddy-frontend:latest` (empacotada com Nginx interno).
* Mapeie a porta do container para a porta `80` ou `8080`.


#### Passo 4: Roteamento e Balanceamento de Carga (Application Load Balancer - ALB)

Como as Tasks Fargate rodam em subnets privadas e ganham IPs dinâmicos a cada deploy, precisamos de um ponto fixo público para receber as requisições do usuário:

1. Crie um **Application Load Balancer (ALB)** público associado às Subnets Públicas da VPC.
2. Crie dois **Target Groups**:
* `tg-teddy-backend`: Direciona o tráfego para a porta `3000` (Tasks da API).
* `tg-teddy-frontend`: Direciona o tráfego para a porta do container Front-End.


3. Configure as regras de roteamento no Listener HTTP/HTTPS do ALB:
* Se o caminho da URL for `/api/*` ou se o subdomínio for `api.seudominio.com` ➡️ Encaminha para `tg-teddy-backend`.
* Para qualquer outro caminho padronizado `/*` ➡️ Encaminha para `tg-teddy-frontend`.

#### Passo 5: Escalabilidade Automática (AWS Auto Scaling)

Para garantir que o sistema aguente picos de acessos no Open Finance sem estourar o orçamento:

1. No serviço do ECS, configure uma **App Autoscaling Policy**.
2. Defina o número mínimo de instâncias/tasks como `2` (para garantir alta disponibilidade caso um servidor da AWS falhe) e o máximo como `10`.
3. Escolha a métrica de escalabilidade baseada no **Target Tracking**: se a média de consumo de CPU do Cluster ultrapassar `70%`, o ECS provisiona automaticamente novas tasks em segundos para absorver a carga de requisições.

## 5. Garantia de Qualidade e Padronização

* **Testes Automatizados**: A integridade das regras de negócios está blindada por testes unitários e de integração utilizando Jest no Back-End e Vitest no Front-End, mantendo mocks isolados de repositórios.
* **Formatadores e Linters**: Uso rigoroso de regras do `ESLint` e `Prettier` aplicados em commits para impedir que códigos desalinhados ou com más práticas entrem no histórico do repositório.
* **Padrão de Mensagens do Git**: Histórico de commits regido estritamente pelas diretrizes do **Conventional Commits**:
* `feat(auth): adiciona geração de token jwt com criptografia bcrypt`
* `fix(clients): ajusta tipagem de cpf/cnpj no dto de entrada`
* `test(backend): adiciona teste unitário de incremento de contador de acessos`

└── README.md             <-- Documentação técnica de arquitetura
