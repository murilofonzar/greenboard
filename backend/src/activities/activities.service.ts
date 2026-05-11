import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  create(dto: any) {
    return this.prisma.activity.create({
      data: {
        title: dto.title,
        description: dto.description,

        educationLevel: dto.educationLevel,
        gradeGroup: dto.gradeGroup,

        grade: dto.grade,
        highSchoolYear: dto.highSchoolYear,

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
        include: {
          questions: true,
        },
      });
    }

    return this.prisma.activity.findMany({
      where: {
        educationLevel: user.educationLevel,
        gradeGroup: user.gradeGroup,

        OR: [
          {
            grade: user.grade,
          },
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
}