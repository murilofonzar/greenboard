/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.activity.create({
      data: {
        title: dto.title,
        description: dto.description,

        educationLevel: dto.educationLevel,

        gradeGroup: dto.gradeGroup || null,
        grade: dto.grade || null,
        highSchoolYear: dto.highSchoolYear || null,

        professorId: dto.professorId,

        questions: {
          create: dto.questions,
        },
      },

      include: {
        questions: true,
      },
    });
  }

  async findAll(user: any) {
    if (user.role === 'PROFESSOR') {
      return this.prisma.activity.findMany({
        where: {
          professorId: user.id,
        },

        include: {
          questions: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    const submissions = await this.prisma.submission.findMany({
      where: {
        studentId: user.id,
      },
      select: {
        activityId: true,
      },
    });

    const answeredIds = submissions.map((s) => s.activityId);

    return this.prisma.activity.findMany({
      where: {
        status: 'PUBLISHED',
        id: {
          notIn: answeredIds,
        },

        educationLevel: user.educationLevel,

        OR: [
          { grade: user.grade },
          {
            highSchoolYear: user.highSchoolYear,
          },
        ],
      },

      include: {
        questions: true,
      },
    });
  }

  async submit(activityId: string, studentId: string, answers: number[]) {
    const exists = await this.prisma.submission.findFirst({
      where: {
        activityId,
        studentId,
      },
    });

    if (exists) {
      throw new BadRequestException('Você já respondeu esta atividade.');
    }

    const activity = await this.prisma.activity.findUnique({
      where: {
        id: activityId,
      },

      include: {
        questions: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada');
    }

    let score = 0;

    activity.questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        score++;
      }
    });

    return this.prisma.submission.create({
      data: {
        activityId,
        studentId,
        answers,
        score,
      },
    });
  }

  async publishActivity(id: string) {
    return this.prisma.activity.update({
      where: {
        id,
      },

      data: {
        status: 'PUBLISHED',
      },
    });
  }

  async getStudentResults(studentId: string) {
    return this.prisma.submission.findMany({
      where: {
        studentId,
      },

      include: {
        activity: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async correctSubmission(
    submissionId: string,
    score: number,
    feedback: string,
  ) {
    return this.prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        score,
        feedback,
        status: 'CORRECTED',
        correctedAt: new Date(),
      },
    });
  }

  async getProfessorResults(professorId: string) {
    return this.prisma.submission.findMany({
      where: {
        activity: {
          professorId,
        },
      },

      include: {
        student: true,

        activity: {
          include: {
            questions: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateActivity(id: string, dto: any) {
    return this.prisma.activity.update({
      where: {
        id,
      },

      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }
}
