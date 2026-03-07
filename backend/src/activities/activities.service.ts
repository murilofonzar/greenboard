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
        professorId: dto.professorId,
        questions: {
          create: dto.questions
        }
      }
    });
  }

  findAll() {
    return this.prisma.activity.findMany({
      include: { questions: true }
    });
  }
}