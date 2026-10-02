# Análise Completa - Greenboard

## 📋 Resumo do Projeto
- **Nome**: Greenboard
- **Objetivo**: Sistema para criar e gerenciar atividades para educação bilíngue
- **Stack**: NestJS (Backend) + React + Vite (Frontend) + PostgreSQL
- **Status**: Em desenvolvimento (v0.0.1)

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. **Segurança: Falta de Validação de Entrada (HIGH)**
**Localização**: [backend/src/activities/activities.controller.ts](backend/src/activities/activities.controller.ts), [backend/src/auth/auth.controller.ts](backend/src/auth/auth.controller.ts)

**Problema**:
- Uso de `@Body() dto: any` sem validação
- Sem uso de DTOs tipados com validação (class-validator)
- Risco de injeção de dados malformados

**Exemplo do Risco**:
```typescript
// ❌ INSEGURO
@Post()
create(@Body() dto: any) {
  return this.service.create(dto); // qualquer dados podem entrar
}
```

**Solução**:
```typescript
// ✅ SEGURO
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateActivityDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  
  @ValidateNested()
  questions: CreateQuestionDTO[];
}

@Post()
create(@Body() dto: CreateActivityDTO) {
  return this.service.create(dto);
}
```

---

### 2. **Autorização Insuficiente (HIGH)**
**Localização**: [backend/src/activities/activities.service.ts](backend/src/activities/activities.service.ts)

**Problema**:
- Falta validação se professor é o dono da atividade antes de editar/deletar
- Qualquer usuário autenticado pode corrigir submissions de qualquer professor
- Falta proteção nas rotas `/:id/update`, `/:id/publish`, `/submission/:id/correct`

**Exemplo do Risco**:
```typescript
// ❌ INSEGURO - Qualquer professor pode corrigir qualquer submission
@Post('submission/:id/correct')
correct(@Param('id') id: string, @Body() body: any) {
  return this.service.correctSubmission(id, body.score, body.feedback);
  // Sem verificar se o professor é dono da atividade!
}
```

**Solução Recomendada**:
- Adicionar verificação de propriedade em operações de edição/delete
- Adicionar middleware/guard customizado para operações sensíveis

---

### 3. **Tipagem Inadequada (MEDIUM)**
**Localização**: Em todo o backend

**Problema**:
- Uso excessivo de `any` type
- Sem DTOs tipados para request/response
- Dificulta manutenção e introduz bugs

**Impacto**: Baixa confiabilidade, difícil refatoração

---

## 🟡 PROBLEMAS IMPORTANTES

### 4. **Falta de Validação de Dados Básica (MEDIUM)**
**Localização**: [backend/src/auth/auth.service.ts](backend/src/auth/auth.service.ts)

**Problema**:
- Sem validação de força de senha
- Sem validação de data de nascimento (pode aceitar datas inválidas)
- Sem sanitização de strings

**Exemplo**:
```typescript
// ❌ Aceita qualquer password
const hash = await bcrypt.hash(data.password, 10);
```

**Solução**: 
```typescript
// ✅ Com validação
export class RegisterDTO {
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain uppercase letter and number'
  })
  password: string;

  @IsDateString()
  @IsBefore(new Date())
  birthDate: string;
}
```

---

### 5. **Falta de Paginação (MEDIUM)**
**Localização**: [backend/src/activities/activities.service.ts](backend/src/activities/activities.service.ts) - método `findAll()`

**Problema**:
- `findAll()` retorna todas as atividades sem paginação
- Não escalável para grandes volumes de dados
- Pode sobrecarregar o servidor e navegador

**Solução**:
```typescript
async findAll(user: any, skip = 0, take = 10) {
  if (user.role === 'PROFESSOR') {
    return this.prisma.activity.findMany({
      where: { professorId: user.id },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { questions: true },
    });
  }
  // ... rest of logic
}
```

---

### 6. **Tratamento de Erros Inconsistente (MEDIUM)**
**Problema**:
- Algumas rotas lançam exceções adequadas, outras não
- Frontend sem tratamento de erros em chamadas de API
- Sem feedback visual de erro para usuário

**Localização**: [frontend/src/pages/Activities.tsx](frontend/src/pages/Activities.tsx)

**Exemplo**:
```typescript
// ❌ Sem try-catch
const loadActivities = async () => {
  const res = await api.get("/activities");
  setActivities(res.data);
};
```

**Solução**:
```typescript
// ✅ Com tratamento
const [error, setError] = useState<string | null>(null);

const loadActivities = async () => {
  try {
    setError(null);
    const res = await api.get("/activities");
    setActivities(res.data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao carregar atividades');
  }
};
```

---

### 7. **Falta de Testes Automatizados (MEDIUM)**
**Problema**:
- Arquivos `.spec.ts` existem mas estão vazios/incompletos
- Sem testes de integração e2e completos
- Sem cobertura de testes críticos

**Impacto**: Risco de regressões durante desenvolvimento

---

### 8. **Validação de Respostas (MEDIUM)**
**Localização**: [backend/src/activities/activities.service.ts](backend/src/activities/activities.service.ts) - método `submit()`

**Problema**:
- Não valida se número de respostas corresponde ao número de questões
- Não valida se índices de respostas são válidos

**Solução**:
```typescript
async submit(activityId: string, studentId: string, answers: number[]) {
  const activity = await this.prisma.activity.findUnique({
    where: { id: activityId },
    include: { questions: true }
  });

  // ✅ Validar
  if (answers.length !== activity.questions.length) {
    throw new BadRequestException('Número de respostas inválido');
  }

  // Validar se índices estão no intervalo válido
  answers.forEach((answer, index) => {
    if (answer < 0 || answer >= activity.questions[index].options.length) {
      throw new BadRequestException(`Resposta ${index} inválida`);
    }
  });
  // ... rest
}
```

---

## 🟢 MELHORIAS RECOMENDADAS

### 9. **Configuração de Ambiente (MEDIUM)**
**Problema**:
- Sem arquivo `.env.example` para documentar variáveis obrigatórias
- `DATABASE_URL` e `JWT_SECRET` não documentados
- Sem validação de variáveis obrigatórias na inicialização

**Solução**:
- Criar `.env.example`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/edu_platform
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h
NODE_ENV=development
```

- Validar em `main.ts`:
```typescript
const requiredEnvs = ['DATABASE_URL', 'JWT_SECRET'];
requiredEnvs.forEach(env => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
});
```

---

### 10. **Logging (LOW - MEDIUM)**
**Problema**:
- Sem logging estruturado
- Dificulta debug em produção

**Solução**: Usar `@nestjs/common` Logger ou Winston

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class ActivitiesService {
  private logger = new Logger(ActivitiesService.name);

  async create(dto: any) {
    this.logger.log(`Creating activity: ${dto.title}`);
    try {
      // ...
    } catch (error) {
      this.logger.error(`Error creating activity: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

---

### 11. **Endpoints Faltantes (MEDIUM)**
**Problema**:
- Sem endpoint GET para atividade específica
- Sem endpoint DELETE para atividades
- Sem endpoint para atualizar apenas score/feedback (PUT partial)

**Sugestões**:
```typescript
@Get(':id')
getOne(@Param('id') id: string) {
  // Get específica
}

@Delete(':id')
delete(@Param('id') id: string, @Req() req: any) {
  // Delete apenas se owner
}

@Put(':id')
update(@Param('id') id: string, @Body() dto: UpdateActivityDTO) {
  // Update com validação
}
```

---

### 12. **Frontend: Loading States e Error Handling (LOW)**
**Localização**: Todo o frontend

**Problema**:
- Sem indicadores de loading durante requisições
- Sem tratamento de erros de rede
- UX ruim durante espera

**Solução**: Custom hook para dados
```typescript
// hooks/useApi.ts
export function useApi<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}
```

---

### 13. **CORS (MEDIUM)**
**Problema**:
- Sem configuração de CORS
- Frontend em localhost:5173, Backend em localhost:3000
- Pode quebrar em produção

**Solução** ([backend/src/main.ts](backend/src/main.ts)):
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

---

### 14. **Migrations e Backup (MEDIUM)**
**Problema**:
- Sem estratégia de backup documentada
- Sem script de seed para dados de teste

**Solução**: Criar script seed
```bash
# package.json
"scripts": {
  "db:seed": "ts-node prisma/seed.ts"
}
```

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('teste123', 10);
  
  await prisma.user.create({
    data: {
      email: 'professor@test.com',
      password,
      role: 'PROFESSOR',
      name: 'Professor Teste',
      birthDate: new Date('1990-01-01'),
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

### 15. **Autenticação: Refresh Token (MEDIUM)**
**Problema**:
- JWT não tem expiração configurada
- Sem refresh token para renovar sessão
- Token pode ser válido indefinidamente

**Solução**: Implementar refresh tokens
```typescript
// auth/auth.service.ts
private sign(user: any) {
  const accessToken = this.jwt.sign(
    { sub: user.id, role: user.role },
    { expiresIn: '15m' }
  );
  
  const refreshToken = this.jwt.sign(
    { sub: user.id },
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

@Public()
@Post('refresh')
refresh(@Body() body: { refreshToken: string }) {
  // Validar refresh token e retornar novo access token
}
```

---

### 16. **Documentação de API (LOW)**
**Problema**:
- Sem documentação de endpoints
- Sem swagger/OpenAPI

**Solução**: Adicionar Swagger
```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Greenboard API')
  .setDescription('API para gerenciamento de atividades')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

---

### 17. **Responsividade Frontend (LOW)**
**Problema**:
- Layout pode não ser responsivo em mobile
- Sidebar pode cobrir conteúdo em telas pequenas

**Melhorias**:
- Teste em diferentes resoluções
- Adicionar hamburger menu para mobile
- Ajustar breakpoints do Tailwind

---

### 18. **Rate Limiting (MEDIUM)**
**Problema**:
- Sem proteção contra brute force
- Sem limite de requisições

**Solução**:
```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      }
    ])
  ]
})
export class AppModule {}
```

---

## 📊 Priorização de Melhorias

| Prioridade | Item | Impacto | Esforço |
|-----------|------|--------|--------|
| 🔴 CRÍTICA | Validação de entrada (DTOs) | Alto | Médio |
| 🔴 CRÍTICA | Verificação de autorização | Alto | Médio |
| 🟠 ALTA | Tratamento de erros | Alto | Baixo |
| 🟠 ALTA | Testes automatizados | Alto | Alto |
| 🟠 ALTA | Configuração de ambiente | Médio | Baixo |
| 🟡 MÉDIA | Paginação | Médio | Baixo |
| 🟡 MÉDIA | CORS | Médio | Baixo |
| 🟡 MÉDIA | Refresh tokens | Médio | Médio |
| 🟡 MÉDIA | Rate limiting | Médio | Baixo |
| 🟢 BAIXA | Swagger/Docs | Baixo | Médio |
| 🟢 BAIXA | Loading states | Baixo | Médio |

---

## 🎯 Plano de Ação Recomendado

### Fase 1 (Segurança - 1-2 semanas)
1. ✅ Implementar DTOs com class-validator
2. ✅ Adicionar verificação de autorização
3. ✅ Implementar validação de entrada

### Fase 2 (Qualidade - 1-2 semanas)
4. ✅ Implementar testes (unit + e2e)
5. ✅ Adicionar tratamento de erros
6. ✅ Configurar variáveis de ambiente

### Fase 3 (Features - 1 semana)
7. ✅ Adicionar paginação
8. ✅ Implementar refresh tokens
9. ✅ Adicionar CORS

### Fase 4 (Documentação - 1 semana)
10. ✅ Swagger/OpenAPI
11. ✅ README detalhado
12. ✅ Documentação de contribuição

---

## 📝 Checklist para Deploy

- [ ] Validação de entrada implementada
- [ ] Testes cobrindo 80%+ do código
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado para produção
- [ ] Rate limiting ativo
- [ ] Logging estruturado
- [ ] Secrets não estão em git
- [ ] Banco de dados com backups
- [ ] Documentação de API completa
- [ ] Plano de rollback definido

---

## 🔗 Referências Úteis

- [NestJS Best Practices](https://docs.nestjs.com)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [class-validator](https://github.com/typestack/class-validator)
- [Prisma Docs](https://www.prisma.io/docs/)

