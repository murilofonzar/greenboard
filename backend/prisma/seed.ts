import { PrismaClient, Role, EducationLevel, GradeGroup, Grade, ActivityType, ActivityStatus, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Criar professor
    const professorPassword = await bcrypt.hash('Professor123', 10);
    
    const professor: User = await prisma.user.create({
      data: {
        name: 'Professor João',
        email: 'professor@example.com',
        password: professorPassword,
        role: Role.PROFESSOR,
        birthDate: new Date('1985-05-15'),
        educationLevel: EducationLevel.ENSINO_FUNDAMENTAL,
        gradeGroup: GradeGroup.ANOS_FINAIS,
      },
    });

    console.log(`✅ Professor criado: ${professor.email}`);

    // Criar estudantes
    const studentPassword = await bcrypt.hash('Student123', 10);
    const students: User[] = [];

    for (let i = 1; i <= 3; i++) {
      const student: User = await prisma.user.create({
        data: {
          name: `Estudante ${i}`,
          email: `student${i}@example.com`,
          password: studentPassword,
          role: Role.ALUNO,
          birthDate: new Date('2010-01-01'),
          educationLevel: EducationLevel.ENSINO_FUNDAMENTAL,
          gradeGroup: GradeGroup.ANOS_FINAIS,
          grade: Grade.OITAVO_ANO,
        },
      });
      students.push(student);
      console.log(`✅ Estudante criado: ${student.email}`);
    }

    // Criar atividade de múltipla escolha
    const multipleChoiceActivity = await prisma.activity.create({
      data: {
        title: 'Vocabulário em Inglês',
        description: 'Atividade sobre vocabulário básico em inglês',
        type: ActivityType.MULTIPLE_CHOICE,
        status: ActivityStatus.PUBLISHED,
        educationLevel: EducationLevel.ENSINO_FUNDAMENTAL,
        gradeGroup: GradeGroup.ANOS_FINAIS,
        grade: Grade.OITAVO_ANO,
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

    // Criar atividade de caça palavras
    const wordSearchActivity = await prisma.activity.create({
      data: {
        title: 'Caça Palavras - Animais',
        description: 'Encontre os nomes de animais em inglês',
        type: ActivityType.WORD_SEARCH,
        status: ActivityStatus.PUBLISHED,
        educationLevel: EducationLevel.ENSINO_FUNDAMENTAL,
        gradeGroup: GradeGroup.ANOS_FINAIS,
        grade: Grade.OITAVO_ANO,
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

    // Criar submissions de exemplo
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
  } catch (error) {
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
