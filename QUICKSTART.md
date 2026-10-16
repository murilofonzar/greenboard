# ⚡ Quick Start - 5 Minutos

## 🎯 Objetivo
Ter a aplicação rodando em 5 minutos

---

## 1️⃣ Pré-requisitos (2 min)

```bash
# ✅ Ter instalado:
# - Node.js 18+
# - PostgreSQL 15+ OU Docker

# ✅ Banco de dados
# Se usar Docker:
cd backend
docker compose up -d
```

---

## 2️⃣ Backend (2 min)

```bash
cd backend

# Instalar
npm install

# Setup banco de dados
npm run db:migrate
npm run db:seed

# Rodar
npm run start:dev
```

**Verificar**: http://localhost:3000 ✅

---

## 3️⃣ Frontend (1 min)

```bash
cd frontend
npm install
npm run dev
```

**Verificar**: http://localhost:5173 ✅

---

## 🔑 Credenciais de Teste

```
Professor:
Email:    professor@example.com
Senha:    Professor123
Role:     PROFESSOR

Aluno:
Email:    student1@example.com
Senha:    Student123
Role:     ALUNO
```

---

## 🎮 Teste Rápido

1. Abra http://localhost:5173
2. Login com credenciais acima
3. Como Professor: Crie uma atividade
4. Como Aluno: Responda a atividade
5. Veja resultados

---

## 📚 Próximo Passo

Ler **[SETUP.md](./SETUP.md)** para detalhes completos

---

✅ Pronto! 🚀
