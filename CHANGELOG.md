# Changelog - Greenboard v1.0.0

## ✨ Principais Melhorias Implementadas

### 🔐 Segurança (Crítica)

- ✅ Implementação de DTOs com `class-validator` em todos os endpoints
- ✅ Validação de força de senha (mínimo 8 caracteres, letra maiúscula, número)
- ✅ Verificação de propriedade de recursos (ownership guards)
- ✅ Rate limiting: 100 req/minuto por IP
- ✅ CORS configurado adequadamente
- ✅ JWT com expiração (15m) + Refresh token (7d)
- ✅ Validação de data de nascimento

### 📚 Qualidade de Código

- ✅ Remover uso de `any` type - todos os endpoints tipados
- ✅ Implementação de filtro global de exceções (`AllExceptionsFilter`)
- ✅ Pipe de validação centralizado
- ✅ Logging estruturado com Logger do NestJS
- ✅ Documentação Swagger/OpenAPI em `/api/docs`

### 🎯 Funcionalidades

- ✅ Novo tipo de atividade: **Caça Palavras**
- ✅ Suporte a grade customizável
- ✅ Componente interativo WordSearch no frontend
- ✅ Página CreateWordSearch para criar atividades
- ✅ Suporte completo em backend (modelos, validação, API)

### 📊 Dados e Paginação

- ✅ Paginação em todos os endpoints de lista (`skip`, `take`)
- ✅ Script de seed com dados de teste
- ✅ Migrations do Prisma documentadas
- ✅ Campos `updatedAt` nos modelos

### 🎮 Experiência do Usuário (Frontend)

- ✅ Hook customizado `useApi` com tratamento de erros
- ✅ Componente `LoadingSpinner` para feedback visual
- ✅ Componente `ErrorAlert` para exibir erros
- ✅ Auto-refresh de token
- ✅ Melhor tratamento de erros de rede

### 🛠️ Developer Experience

- ✅ `.env.example` documentado
- ✅ Testes unitários com Jest (exemplo em auth.service.spec.ts)
- ✅ Scripts npm úteis: `db:seed`, `db:migrate`
- ✅ README completo em português
- ✅ Tipos TypeScript compartilhados (frontend/backend)

---

## 🔄 Mudanças na API

### Novos Endpoints

```
POST   /auth/refresh                    # Renovar token
GET    /activities/:id                 # Get específico
PUT    /activities/:id                 # Update com autorização
DELETE /activities/:id                 # Delete com autorização
```

### Endpoints Modificados

```
GET    /activities              # Agora suporta paginação (skip, take)
GET    /activities/results/student
GET    /activities/results/professor
POST   /activities/:id/submit   # Suporta caça palavras (foundWords)
```

### Respostas de Autenticação

Agora retornam `refresh_token`:

```json
{
  "access_token": "jwt...",
  "refresh_token": "jwt...",
  "user": { ... }
}
```

---

## 📦 Dependências Novas

### Backend

```json
"@nestjs/swagger": "^8.0.0",
"@nestjs/throttler": "^5.1.0",
"class-transformer": "^0.5.1",
"class-validator": "^0.14.1",
"swagger-ui-express": "^5.0.1"
```

---

## 📁 Estrutura de Pastas

### Novos Arquivos

```
backend/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts      (novo)
│   │   │   └── login.dto.ts         (novo)
│   │   └── guards/
│   │       └── activity-owner.guard.ts  (novo)
│   ├── activities/
│   │   └── dto/
│   │       ├── create-activity.dto.ts  (novo)
│   │       └── submit-activity.dto.ts  (novo)
│   ├── common/
│   │   ├── filters/
│   │   │   └── all-exceptions.filter.ts  (novo)
│   │   └── pipes/
│   │       └── validation.pipe.ts    (novo)
├── prisma/
│   └── seed.ts                       (novo)
└── .env.example                      (novo)

frontend/
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.tsx        (novo)
│   │   ├── ErrorAlert.tsx            (novo)
│   │   └── WordSearch.tsx            (novo)
│   ├── hooks/
│   │   └── useApi.ts                 (novo)
│   ├── pages/
│   │   └── CreateWordSearch.tsx      (novo)
│   └── types/
│       └── index.ts                  (novo)
└── .env.example                      (novo)

├── README_PT.md                       (novo)
└── CHANGELOG.md                       (novo)
```

---

## 🔧 Configurações Importantes

### Prisma Schema

Novos campos/modelos:
- `ActivityType` enum (MULTIPLE_CHOICE, WORD_SEARCH)
- `Activity.type` field
- `Activity.updatedAt` field
- `WordSearch` model completo
- `Submission.foundWords` array

### JWT

```
Access Token:  15 minutos de expiração
Refresh Token: 7 dias de expiração
```

### Rate Limiting

```
100 requisições / 60 segundos / IP
```

---

## 🧪 Testes Inclusos

- `auth.service.spec.ts` - Exemplos de testes unitários
  - ✅ Register com email duplicado
  - ✅ Login com credenciais válidas/inválidas
  - ✅ Refresh token

---

## 📊 Checklist de Melhorias

- [x] Validação de entrada com DTOs
- [x] Autorização de recursos (owner check)
- [x] Tratamento de erros global
- [x] Paginação em listas
- [x] JWT com expiração
- [x] Rate limiting
- [x] CORS configurado
- [x] Swagger/OpenAPI docs
- [x] Logging estruturado
- [x] Testes unitários
- [x] Novo tipo de atividade (Caça Palavras)
- [x] Componentes reutilizáveis (frontend)
- [x] Hook useApi customizado
- [x] Documentação README
- [x] Seed script
- [x] .env.example

---

## 🚀 Próximos Passos Recomendados

1. **Executar migrations do Prisma**: `npm run db:migrate`
2. **Carregar dados de teste**: `npm run db:seed`
3. **Instalar dependências**: `npm install`
4. **Testar API**: `npm run test`
5. **Iniciar desenvolvimento**: `npm run start:dev`

---

## ⚠️ Breaking Changes

- `POST /activities/:id/update` → `PUT /activities/:id`
- `/activities/submit/:id` → `POST /activities/:id/submit`
- Resposta de login inclui `refresh_token`
- Todos os DTOs agora requerem validação

---

## 📝 Notas Importantes

1. **Migrations**: Necessário rodar `npm run db:migrate` antes de iniciar
2. **Seeds**: `npm run db:seed` popula banco com dados de teste
3. **JWT_SECRET**: Mude em produção!
4. **CORS_ORIGIN**: Configure URL correta do frontend

---

**Versão**: 1.0.0  
**Data**: Setembro 2026  
**Status**: ✅ Pronto para desenvolvimento
