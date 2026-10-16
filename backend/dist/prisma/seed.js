"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');
    try {
        const professorPassword = await bcrypt.hash('Professor123', 10);
        const professor = await prisma.user.create({
            data: {
                name: 'Professor João',
                email: 'professor@example.com',
                password: professorPassword,
                role: client_1.Role.PROFESSOR,
                birthDate: new Date('1985-05-15'),
                educationLevel: client_1.EducationLevel.ENSINO_FUNDAMENTAL,
                gradeGroup: client_1.GradeGroup.ANOS_FINAIS,
            },
        });
        console.log(`✅ Professor criado: ${professor.email}`);
        const studentPassword = await bcrypt.hash('Student123', 10);
        const students = [];
        for (let i = 1; i <= 3; i++) {
            const student = await prisma.user.create({
                data: {
                    name: `Estudante ${i}`,
                    email: `student${i}@example.com`,
                    password: studentPassword,
                    role: client_1.Role.ALUNO,
                    birthDate: new Date('2010-01-01'),
                    educationLevel: client_1.EducationLevel.ENSINO_FUNDAMENTAL,
                    gradeGroup: client_1.GradeGroup.ANOS_FINAIS,
                    grade: client_1.Grade.OITAVO_ANO,
                },
            });
            students.push(student);
            console.log(`✅ Estudante criado: ${student.email}`);
        }
        const multipleChoiceActivity = await prisma.activity.create({
            data: {
                title: 'Vocabulário em Inglês',
                description: 'Atividade sobre vocabulário básico em inglês',
                type: client_1.ActivityType.MULTIPLE_CHOICE,
                status: client_1.ActivityStatus.PUBLISHED,
                educationLevel: client_1.EducationLevel.ENSINO_FUNDAMENTAL,
                gradeGroup: client_1.GradeGroup.ANOS_FINAIS,
                grade: client_1.Grade.OITAVO_ANO,
                professorId: professor.id,
                questions: {
                    create: [
                        {
                            statement: 'Qual é a tradução de "casa" em inglês?',
                            options: ['House', 'Tree', 'Car', 'Door'],
                            answer: 0,
                        },
                        {
                            statement: 'Qual é a tradução de "livro" em inglês?',
                            options: ['Pen', 'Book', 'Table', 'Chair'],
                            answer: 1,
                        },
                        {
                            statement: 'Qual é a tradução de "gato" em inglês?',
                            options: ['Dog', 'Cat', 'Bird', 'Fish'],
                            answer: 1,
                        },
                    ],
                },
            },
        });
        console.log(`✅ Atividade de múltipla escolha criada`);
        const wordSearchActivity = await prisma.activity.create({
            data: {
                title: 'Caça Palavras - Animais',
                description: 'Encontre os nomes de animais em inglês',
                type: client_1.ActivityType.WORD_SEARCH,
                status: client_1.ActivityStatus.PUBLISHED,
                educationLevel: client_1.EducationLevel.ENSINO_FUNDAMENTAL,
                gradeGroup: client_1.GradeGroup.ANOS_FINAIS,
                grade: client_1.Grade.OITAVO_ANO,
                professorId: professor.id,
                wordSearch: {
                    create: {
                        grid: ['CATDOGS', 'BIRDLEO', 'FISHMLO', 'HORSEON', 'MONKEYK', 'ELEPHAN'],
                        words: ['CAT', 'DOG', 'BIRD', 'FISH', 'HORSE', 'MONKEY', 'ELEPHANT', 'LION'],
                        orientation: ['h', 'h', 'h', 'h', 'h', 'h', 'v', 'v'],
                        positions: ['0,0', '0,2', '1,1', '2,1', '3,1', '4,1', '1,5', '2,5'],
                    },
                },
            },
        });
        console.log(`✅ Atividade de caça palavras criada`);
        for (let i = 0; i < students.length; i++) {
            await prisma.submission.create({
                data: {
                    studentId: students[i].id,
                    activityId: multipleChoiceActivity.id,
                    answers: [0, 1, 1],
                    score: 3,
                    status: 'CORRECTED',
                    feedback: 'Excelente trabalho!',
                    correctedAt: new Date(),
                    foundWords: [],
                },
            });
            await prisma.submission.create({
                data: {
                    studentId: students[i].id,
                    activityId: wordSearchActivity.id,
                    foundWords: ['CAT', 'DOG', 'BIRD', 'FISH', 'HORSE', 'MONKEY'],
                    score: 75,
                    status: 'PENDING',
                    answers: [],
                },
            });
        }
        console.log(`✅ Submissions criados`);
        console.log('✨ Seed concluído com sucesso!');
    }
    catch (error) {
        console.error('❌ Erro durante seed:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map