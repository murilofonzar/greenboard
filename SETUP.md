# 🚀 Setup Greenboard - Guia Passo a Passo

## 📋 Pré-requisitos

- [Node.js 18+](https://nodejs.org/) ✅
- [PostgreSQL 15+](https://www.postgresql.org/) ✅
- [Docker](https://www.docker.com/) (opcional, para PostgreSQL)
- npm ou yarn

---

## 🗄️ Parte 1: Configurar o Banco de Dados

### Opção A: Docker (Recomendado)

```bash
# No diretório do projeto
cd backend

# Subir container PostgreSQL
docker compose up -d

# Verificar se está rodando
docker ps
```

**Resultado esperado:**
```
✅ Container 'edu_postgres' rodando
📦 PostgreSQL 15 disponível em localhost:5432
```

### Opção B: PostgreSQL Local

```bash
# Linux/Mac
createdb edu_platform

# Windows (via psql)
psql -U postgres
> CREATE DATABASE edu_platform;
```

---

## 🔧 Parte 2: Backend Setup

### 1️⃣ Instalar dependências

```bash
cd backend
npm install
```

**Saída esperada:**
```
added 400+ packages in 2m
```

### 2️⃣ Configurar variáveis de ambiente

```bash
# Copiar template
cp .env.example .env

# Editar .env (ajustar DATABASE_URL se necessário)
# Windows: notepad .env
# Mac/Linux: nano .env
```

**Conteúdo típico:**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edu_platform
JWT_SECRET=seu-super-secret-key-mude-isso-em-producao
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### 3️⃣ Executar migrations

```bash
npm run db:migrate
```

**Saída esperada:**
```
✅ 20260615193128_init ... 0.234m
Migrations applied successfully
```

### 4️⃣ Carregar dados de teste (opcional)

```bash
npm run db:seed
```

**Saída esperada:**
```
🌱 Iniciando seed...
✅ Professor criado: professor@example.com
✅ Estudante criado: student1@example.com
✨ Seed concluído com sucesso!
```

### 5️⃣ Iniciar backend em desenvolvimento

```bash
npm run start:dev
```

**Saída esperada:**
```
[Nest] XXXXX - 09/11/2026, XXX:XX:XX PM     LOG [NestFactory] Creating Nest application...
[Nest] XXXXX - 09/11/2026, XXX:XX:XX PM     LOG [InstanceLoader] PrismaModule dependencies initialized
✅ Aplicação rodando em http://localhost:3000
📚 Documentação em http://localhost:3000/api/docs
```

### ✅ Verificação Backend

Abra no navegador:
- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api/docs
- **Health Check**: `curl http://localhost:3000`

---

## 🎨 Parte 3: Frontend Setup

### 1️⃣ Instalar dependências

```bash
cd frontend
npm install
```

### 2️⃣ Configurar variáveis (opcional)

```bash
# Se backend não está em localhost:3000
cp .env.example .env.local
# Editar .env.local
```

### 3️⃣ Iniciar frontend em desenvolvimento

```bash
npm run dev
```

**Saída esperada:**
```
  VITE v5.3.1  ready in 456 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### ✅ Verificação Frontend

Abra no navegador: http://localhost:5173

---

## 🔓 Testando a Aplicação

### 1️⃣ Acessar aplicação

Abra: **http://localhost:5173**

### 2️⃣ Criar conta (se não rodou seed)

- Clique em "Register"
- Preencha formulário:
  - **Email**: seu-email@example.com
  - **Senha**: MinhaSenh@123 (mínimo 8 chars, letra maiúscula, número)
  - **Role**: Selecione PROFESSOR ou ALUNO
  - **Data de nascimento**: 01/01/2000

### 3️⃣ Fazer login com dados de teste

Se rodou `npm run db:seed`:

**Professor:**
- Email: `professor@example.com`
- Senha: `Professor123`

**Aluno:**
- Email: `student1@example.com`
- Senha: `Student123`

### 4️⃣ Testar funcionalidades

**Como Professor:**
1. ✅ Ver "Criar Atividade"
2. ✅ Criar atividade de múltipla escolha
3. ✅ Criar atividade de caça palavras
4. ✅ Publicar atividades
5. ✅ Ver resultados dos alunos

**Como Aluno:**
1. ✅ Ver atividades publicadas
2. ✅ Responder atividades
3. ✅ Ver próprios resultados

---

## 🧪 Executar Testes

```bash
cd backend

# Unit tests
npm run test

# Watch mode (rerun on changes)
npm run test:watch

# Com coverage
npm run test:cov
```

**Resultado esperado:**
```
PASS  src/auth/auth.service.spec.ts
  AuthService
    ✓ should be defined
    ✓ should register a new user
    ✓ should login successfully
    ✓ should throw error on invalid credentials
```

---

## 🛠️ Troubleshooting

### ❌ Erro: "Cannot connect to PostgreSQL"

```bash
# Verificar se banco está rodando
docker ps

# Se usando Docker Compose
docker-compose restart postgres

# Se banco local
# Windows: services.msc e procurar PostgreSQL
# Mac: brew services restart postgresql
```

### ❌ Erro: "Port 3000 already in use"

```bash
# Encontrar processo usando porta
# Linux/Mac: lsof -i :3000
# Windows: netstat -ano | findstr :3000

# Usar porta diferente
PORT=3001 npm run start:dev
```

### ❌ Erro: "CORS blocked"

Verificar:
1. Backend: `CORS_ORIGIN=http://localhost:5173` em `.env`
2. Frontend: `VITE_API_URL=http://localhost:3000` em `.env.local`
3. Reiniciar ambas aplicações

### ❌ Erro: "JWT token expired"

Token é automaticamente renovado. Se falhar:

```bash
# Fazer logout e login novamente
# Limpar localStorage
localStorage.clear()
# Recarregar página
```

### ❌ Erro durante `npm run db:migrate`

```bash
# Resetar banco de dados
npm run db:migrate:reset

# Depois rodar seed novamente
npm run db:seed
```

---

## 📊 Estrutura de Pastas Após Setup

```
greenboard/
├── backend/
│   ├── node_modules/
│   ├── src/
│   ├── prisma/
│   ├── .env                    ← Criado localmente
│   ├── dist/                   ← Gerado ao build
│   └── package.json
├── frontend/
│   ├── node_modules/
│   ├── src/
│   ├── .env.local              ← Criado localmente (opcional)
│   ├── dist/                   ← Gerado ao build
│   └── package.json
├── README_PT.md
├── CHANGELOG.md
└── docker-compose.yml
```

---

## 🚀 Comandos Úteis

```bash
# Backend
cd backend
npm run start:dev          # Inicia em desenvolvimento (watch mode)
npm run build              # Build para produção
npm run lint               # Linter + fix
npm run format             # Prettier
npm run test               # Testes unitários
npm run db:seed            # Carregar dados de teste
npm run db:migrate         # Rodar migrations

# Frontend
cd frontend
npm run dev                # Inicia em desenvolvimento
npm run build              # Build para produção
npm run preview            # Preview do build
npm run lint               # Linter
```

---

## 📚 Documentação Importante

- **Swagger API**: http://localhost:3000/api/docs
- **README Completo**: [README_PT.md](../README_PT.md)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md)
- **Análise Detalhada**: [ANALISE_MELHORIAS.md](../ANALISE_MELHORIAS.md)

---

## ✅ Checklist de Verificação

- [ ] PostgreSQL rodando (Docker ou local)
- [ ] Backend: `npm install` completo
- [ ] Backend: `.env` configurado
- [ ] Backend: `npm run db:migrate` executado
- [ ] Backend: `npm run db:seed` executado
- [ ] Backend: `npm run start:dev` iniciado com sucesso
- [ ] Frontend: `npm install` completo
- [ ] Frontend: `npm run dev` iniciado com sucesso
- [ ] Conseguir acessar http://localhost:5173
- [ ] Conseguir fazer login/registro
- [ ] Swagger acessível em http://localhost:3000/api/docs
- [ ] Criar e publicar uma atividade
- [ ] Responder uma atividade como aluno

---

## 🎉 Próximos Passos

1. **Explorar Swagger**: Veja toda a API documentada
2. **Testar Caça Palavras**: Crie uma atividade do novo tipo
3. **Ler Código**: Entender estrutura do projeto
4. **Executar Testes**: `npm run test` no backend
5. **Build para Produção**: `npm run build` em ambos

---

## 💡 Tips

- Use `npm run start:debug` para debug com breakpoints
- Swagger é excelente para testar endpoints
- Dados de teste ajudam a entender o fluxo
- ESLint ajuda a manter código limpo
- Prettier formata código automaticamente

---

**Pronto! 🎊 Seu ambiente está configurado e pronto para desenvolvimento!**

Qualquer dúvida, consulte os arquivos de documentação ou execute `npm run --help` para ver todos os scripts disponíveis.
