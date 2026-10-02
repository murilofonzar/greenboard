# Greenboard - Sistema de Gestão de Atividades Educacionais Bilíngues

## 🎯 Visão Geral

Greenboard é um sistema web moderno para criar, gerenciar e responder atividades educacionais bilíngues. O sistema suporta dois tipos de atividades:

1. **Múltipla Escolha**: Questões com opções para seleção
2. **Caça Palavras**: Grade interativa para encontrar palavras ocultas

## ✨ Melhorias Implementadas

### 🔐 Segurança

- ✅ **Validação de Entrada**: Todos os DTOs utilizam `class-validator` para validação robusta
- ✅ **Autorização de Recursos**: Guards customizados garantem que usuários só acessem recursos próprios
- ✅ **Hashing de Senha**: Bcrypt com 10 rounds
- ✅ **JWT com Expiração**: Access token (15m) + Refresh token (7d)
- ✅ **Rate Limiting**: 100 requisições por minuto por IP
- ✅ **CORS Configurado**: Apenas localhost:5173 em desenvolvimento

### 📚 Qualidade de Código

- ✅ **DTOs Tipados**: Todas as requisições validadas com class-validator
- ✅ **Tratamento de Erros Global**: AllExceptionsFilter em toda aplicação
- ✅ **Logging Estruturado**: Logger do NestJS em operações críticas
- ✅ **Paginação**: Todos os endpoints de lista suportam `skip` e `take`
- ✅ **Documentação Swagger**: API documentada em `/api/docs`

### 🎮 Funcionalidades

- ✅ **Suporte a Caça Palavras**: Novo tipo de atividade com grade customizável
- ✅ **Múltiplos Níveis**: Ensino Fundamental e Médio
- ✅ **Resultados Detalhados**: Professores podem corrigir e dar feedback

### 🛠️ Developer Experience

- ✅ **Seed Script**: Dados de teste com `npm run db:seed`
- ✅ **Testes Unitários**: Exemplos em `auth.service.spec.ts`
- ✅ **Environment Variables**: `.env.example` documentado
- ✅ **API Hook**: Custom hook `useApi` no frontend
- ✅ **Componentes Reutilizáveis**: LoadingSpinner, ErrorAlert, WordSearch

---

## 🚀 Instalação e Setup

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- npm ou yarn

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Executar migrations
npm run db:migrate

# Carregar dados de teste (opcional)
npm run db:seed

# Iniciar em desenvolvimento
npm run start:dev
```

**API disponível em**: `http://localhost:3000`  
**Documentação**: `http://localhost:3000/api/docs`

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis (opcional)
cp .env.example .env.local

# Iniciar em desenvolvimento
npm run dev
```

**App disponível em**: `http://localhost:5173`

---

## 📖 Variáveis de Ambiente

### Backend (`.env`)

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edu_platform

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=15m

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`.env.local`)

```bash
VITE_API_URL=http://localhost:3000
```

---

## 📚 Estrutura do Projeto

```
backend/
├── src/
│   ├── auth/                    # Autenticação e autorização
│   │   ├── dto/                 # Data Transfer Objects validados
│   │   ├── guards/              # Guards customizados
│   │   └── auth.service.ts
│   ├── activities/              # Gerenciamento de atividades
│   │   ├── dto/                 # DTOs para criação/atualização
│   │   └── activities.service.ts
│   ├── common/
│   │   ├── filters/             # Filtro global de exceções
│   │   └── pipes/               # Pipe de validação
│   └── prisma/                  # ORM Prisma
├── prisma/
│   ├── schema.prisma            # Schema do banco de dados
│   ├── migrations/              # Histórico de migrations
│   └── seed.ts                  # Script de seed
└── test/                        # Testes e2e

frontend/
├── src/
│   ├── components/              # Componentes React reutilizáveis
│   │   ├── ErrorAlert.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── WordSearch.tsx
│   ├── hooks/                   # Custom hooks
│   │   └── useApi.ts
│   ├── pages/                   # Páginas principais
│   │   ├── Activities.tsx
│   │   ├── CreateActivity.tsx
│   │   ├── CreateWordSearch.tsx
│   │   └── ...
│   ├── types/                   # Definições de tipos
│   ├── api.ts                   # Configuração do Axios
│   └── auth.ts                  # Gerenciamento de autenticação
└── public/                      # Assets estáticos
```

---

## 🔑 API Endpoints

### Autenticação

```
POST   /auth/register/student    # Cadastrar aluno
POST   /auth/register/professor  # Cadastrar professor (accessCode se PROFESSOR_REGISTRATION_CODE estiver definido)
POST   /auth/login               # Fazer login
POST   /auth/refresh             # Renovar access token
GET    /auth/me                  # Usuário autenticado
```

### Mídia

```
POST   /media/upload            # Upload de imagem/áudio (PROFESSOR, multipart campo "file", até 10 MB)
GET    /uploads/:arquivo        # Arquivo enviado (público)
```

Use a URL retornada em `media[]` ou em `questions[].imageUrl` / `questions[].audioUrl` ao criar/editar atividades.

Collection do Postman: `backend/postman/Greenboard.postman_collection.json`.

### Atividades

```
POST   /activities              # Criar atividade (PROFESSOR)
GET    /activities              # Listar atividades
GET    /activities/:id          # Obter atividade específica
PUT    /activities/:id          # Atualizar atividade (PROFESSOR)
DELETE /activities/:id          # Deletar atividade (PROFESSOR)
POST   /activities/:id/publish  # Publicar atividade (PROFESSOR)
POST   /activities/:id/submit   # Submeter respostas (ALUNO)
```

### Resultados

```
GET    /activities/results/student    # Resultados do aluno
GET    /activities/results/professor  # Resultados do professor
POST   /activities/submission/:id/correct  # Corrigir submission (PROFESSOR)
```

---

## 🧪 Testes

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 📝 Tipos de Atividades

### Múltipla Escolha

```json
{
  "title": "Vocabulário em Inglês",
  "description": "Questões sobre vocabulário",
  "type": "MULTIPLE_CHOICE",
  "educationLevel": "ENSINO_FUNDAMENTAL",
  "questions": [
    {
      "statement": "Como se diz 'casa' em inglês?",
      "options": ["House", "Tree", "Car"],
      "answer": 0
    }
  ]
}
```

### Caça Palavras

```json
{
  "title": "Caça Palavras - Animais",
  "description": "Encontre os nomes de animais",
  "type": "WORD_SEARCH",
  "educationLevel": "ENSINO_FUNDAMENTAL",
  "grid": [
    "CATDOGS",
    "BIRDLEO",
    "FISHMLO"
  ],
  "words": ["CAT", "DOG", "BIRD", "FISH"]
}
```

---

## 🔒 Permissões por Role

| Ação | PROFESSOR | ALUNO |
|------|-----------|-------|
| Criar atividade | ✅ | ❌ |
| Editar própria atividade | ✅ | ❌ |
| Publicar atividade | ✅ | ❌ |
| Ver atividades publicadas | ✅ | ✅ |
| Responder atividade | ❌ | ✅ |
| Corrigir submission | ✅ | ❌ |
| Ver próprios resultados | ✅ | ✅ |

---

## 🐛 Troubleshooting

### Erro: "DATABASE_URL não configurada"

```bash
# Verificar .env no backend
cat backend/.env
# DATABASE_URL deve estar configurada
```

### Erro: "Port 3000 já em uso"

```bash
# Usar porta diferente
PORT=3001 npm run start:dev
```

### Erro: "CORS bloqueado"

Verifique:
1. `CORS_ORIGIN` em `.env` do backend
2. URL do frontend está correta
3. API URL está correta no frontend

### Erro: "Token expirado"

O token é automaticamente renovado via refresh token. Se continuar com erro:

1. Faça logout: `localStorage.removeItem('auth')`
2. Faça login novamente
3. Verifique `JWT_SECRET` em `.env`

---

## 📊 Banco de Dados

### Modelos Principais

```typescript
User {
  id: string
  email: string (unique)
  password: string (hashed)
  name: string
  role: Role
  birthDate: DateTime
  educationLevel: EducationLevel
  // ... mais campos
}

Activity {
  id: string
  title: string
  description: string
  type: ActivityType (MULTIPLE_CHOICE | WORD_SEARCH)
  status: ActivityStatus (DRAFT | PUBLISHED)
  professorId: string
  // ... mais campos
}

Question {
  id: string
  statement: string
  options: string[]
  answer: number
  activityId: string
}

WordSearch {
  id: string
  grid: string[]
  words: string[]
  orientation: string[]
  positions: string[]
  activityId: string
}

Submission {
  id: string
  studentId: string
  activityId: string
  answers: number[] (para múltipla escolha)
  foundWords: string[] (para caça palavras)
  score: number
  feedback: string
  status: SubmissionStatus
}
```

---

## 🚀 Deploy

### Backend

```bash
# Build
npm run build

# Rodar em produção
NODE_ENV=production npm run start:prod
```

### Frontend

```bash
# Build
npm run build

# Preview
npm run preview
```

---

## 📚 Referências

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [class-validator](https://github.com/typestack/class-validator)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📄 Licença

Este projeto é licenciado sob a Licença UNLICENSED.

---

## 👥 Contribuindo

Para contribuir:

1. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
2. Faça commit das mudanças: `git commit -am 'Adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

---

## ❓ Suporte

Para questões ou problemas:

1. Abra uma issue no GitHub
2. Descreva o problema detalhadamente
3. Forneça passos para reproduzir
4. Incluir logs de erro

---

**Desenvolvido com ❤️ para educação bilíngue**
