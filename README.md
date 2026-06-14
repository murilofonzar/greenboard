# Greenboard

Sistema para auxiliar na criação de atividades para o ensino bilíngue.

## Tecnologias

### Frontend

* React 19
* Vite
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* NestJS
* Prisma ORM
* PostgreSQL
* JWT Authentication

## Pré-requisitos

* Node.js 22+
* Docker
* Docker Compose

## Estrutura do Projeto

```text
greenboard/
├── backend/
└── frontend/
```

## Configuração do Ambiente

Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:

```env
JWT_SECRET=supersecret
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edu_platform
```

### Variáveis de Ambiente

| Variável     | Descrição                                               |
| ------------ | ------------------------------------------------------- |
| JWT_SECRET   | Chave utilizada para geração e validação dos tokens JWT |
| DATABASE_URL | String de conexão com o banco PostgreSQL                |

## Instalação

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Banco de Dados

Dentro da pasta `backend`, execute:

```bash
docker pull murilofonzar/postgres:15
docker compose up --build
```

## Executando o Backend

Dentro da pasta `backend` execute:

```bash
npm run start:dev
```

API disponível em:

```text
http://localhost:3000
```

### Endpoints de Autenticação

| Método | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |

## Executando o Frontend

Dentro da pasta `frontend` execute:

```bash
npm run dev
```

Aplicação disponível em:

```text
http://localhost:5173
```

## Scripts Úteis

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm run start
npm run start:dev
npm run build
npm run test
npm run test:cov
npm run lint
```

## Fluxo de Execução

1. Configurar o arquivo `.env`
2. Instalar dependências do backend
3. Instalar dependências do frontend
4. Iniciar o PostgreSQL via Docker
5. Executar as migrações do Prisma
6. Iniciar o backend
7. Iniciar o frontend
8. Acessar a aplicação em `http://localhost:5173`
