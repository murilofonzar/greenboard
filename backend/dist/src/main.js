"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const app_module_1 = require("./app.module");
const upload_dir_1 = require("./media/upload-dir");
async function bootstrap() {
    if ((0, fs_1.existsSync)('.env')) {
        process.loadEnvFile?.('.env');
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
    });
    app.useStaticAssets((0, upload_dir_1.getUploadDir)(), {
        prefix: '/uploads/',
        index: false,
        dotfiles: 'deny',
        setHeaders: (res) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Greenboard API')
        .setDescription([
        'API para gerenciamento de atividades educacionais bilíngues.',
        '',
        '**Fluxo básico:**',
        '1. Cadastre um professor (`POST /auth/register/professor`) ou aluno (`POST /auth/register/student`).',
        '2. Faça login (`POST /auth/login`) e clique em **Authorize** informando o `access_token`.',
        '3. Professores enviam imagens/áudios em `POST /media/upload` e usam as URLs retornadas ao criar atividades.',
        '4. Arquivos enviados ficam disponíveis publicamente em `/uploads/<arquivo>`.',
    ].join('\n'))
        .setVersion('1.1')
        .addBearerAuth()
        .addTag('Auth', 'Cadastro de alunos/professores, login e tokens')
        .addTag('Activities', 'Atividades, submissões e resultados')
        .addTag('Media', 'Upload de imagens e áudios para atividades')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`✅ Aplicação rodando em http://localhost:${port}`);
    console.log(`📚 Documentação em http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map