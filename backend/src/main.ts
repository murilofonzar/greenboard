import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { existsSync } from 'fs';
import { AppModule } from './app.module';
import { getUploadDir } from './media/upload-dir';

async function bootstrap() {
  // Node >= 20.12 carrega o .env nativamente; em versões antigas defina as variáveis no ambiente
  if (existsSync('.env')) {
    process.loadEnvFile?.('.env');
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Arquivos de mídia enviados pelos professores
  app.useStaticAssets(getUploadDir(), {
    prefix: '/uploads/',
    index: false,
    dotfiles: 'deny',
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Greenboard API')
    .setDescription(
      [
        'API para gerenciamento de atividades educacionais bilíngues.',
        '',
        '**Fluxo básico:**',
        '1. Cadastre um professor (`POST /auth/register/professor`) ou aluno (`POST /auth/register/student`).',
        '2. Faça login (`POST /auth/login`) e clique em **Authorize** informando o `access_token`.',
        '3. Professores enviam imagens/áudios em `POST /media/upload` e usam as URLs retornadas ao criar atividades.',
        '4. Arquivos enviados ficam disponíveis publicamente em `/uploads/<arquivo>`.',
      ].join('\n'),
    )
    .setVersion('1.1')
    .addBearerAuth()
    .addTag('Auth', 'Cadastro de alunos/professores, login e tokens')
    .addTag('Activities', 'Atividades, submissões e resultados')
    .addTag('Media', 'Upload de imagens e áudios para atividades')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`✅ Aplicação rodando em http://localhost:${port}`);
  console.log(`📚 Documentação em http://localhost:${port}/api/docs`);
}

bootstrap();