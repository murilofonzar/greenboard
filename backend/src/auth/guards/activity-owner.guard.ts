import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const activityId = request.params.id;

    if (!activityId || !user) {
      throw new ForbiddenException('Não autorizado');
    }

    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada');
    }

    // Apenas o professor que criou a atividade pode editar
    if (activity.professorId !== user.sub) {
      throw new ForbiddenException(
        'Você não tem permissão para editar atividades de outros professores',
      );
    }

    request.activity = activity;
    return true;
  }
}
