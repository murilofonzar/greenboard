import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ActivityMediaDTO,
  CreateActivityDTO,
  CreateQuestionDTO,
  UpdateActivityDTO,
} from './dto/create-activity.dto';
import {
  GuestSubmitActivityDTO,
  SubmitActivityDTO,
  CorrectSubmissionDTO,
} from './dto/submit-activity.dto';
import {
  ActivityType,
  EducationLevel,
  Grade,
  GradeGroup,
  HighSchoolGrade,
  Prisma,
  Role,
} from '@prisma/client';

const ACTIVITY_INCLUDE = {
  questions: true,
  wordSearch: true,
  media: { orderBy: { order: 'asc' } },
} satisfies Prisma.ActivityInclude;

type ActivityWithRelations = Prisma.ActivityGetPayload<{
  include: typeof ACTIVITY_INCLUDE;
}>;

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateActivityDTO, professorId: string) {
    this.logger.log(`Criando atividade: ${dto.title} para professor ${professorId}`);

    if (dto.type === ActivityType.MULTIPLE_CHOICE && !dto.questions?.length) {
      throw new BadRequestException(
        'Atividade de múltipla escolha requer questões',
      );
    }

    if (dto.type === ActivityType.WORD_SEARCH && !dto.grid?.length) {
      throw new BadRequestException(
        'Atividade de caça palavras requer uma grade',
      );
    }

    this.assertValidAnswers(dto.questions);

    return await this.prisma.activity.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type || ActivityType.MULTIPLE_CHOICE,
        educationLevel: dto.educationLevel,
        gradeGroup: dto.gradeGroup || null,
        grade: dto.grade || null,
        highSchoolYear: dto.highSchoolYear || null,
        professorId,
        media: { create: this.toMediaData(dto.media) },
        ...(dto.type === ActivityType.MULTIPLE_CHOICE && {
          questions: {
            create: this.toQuestionData(dto.questions),
          },
        }),
        ...(dto.type === ActivityType.WORD_SEARCH && {
          wordSearch: {
            create: {
              grid: dto.grid,
              words: dto.words || [],
              orientation: dto.orientation || [],
              positions: dto.positions || [],
            },
          },
        }),
      },
      include: ACTIVITY_INCLUDE,
    });
  }

  async findAll(userId: string, userRole: string, skip = 0, take = 10) {
    if (userRole === Role.PROFESSOR) {
      return await this.prisma.activity.findMany({
        where: {
          professorId: userId,
        },
        include: ACTIVITY_INCLUDE,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      });
    }

    const student = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        educationLevel: true,
        gradeGroup: true,
        grade: true,
        highSchoolYear: true,
      },
    });
    if (
      !student ||
      student.educationLevel === null ||
      student.gradeGroup === null
    ) {
      throw new BadRequestException('O perfil do aluno não possui etapa e ano escolar');
    }
    const studentProfile = {
      educationLevel: student.educationLevel,
      gradeGroup: student.gradeGroup,
      grade: student.grade,
      highSchoolYear: student.highSchoolYear,
    };

    const submissions = await this.prisma.submission.findMany({
      where: {
        studentId: userId,
      },
      select: {
        activityId: true,
      },
    });

    const answeredIds = submissions.map((s) => s.activityId);

    const activities = await this.prisma.activity.findMany({
      where: {
        ...this.getStudentActivityFilter(studentProfile),
        id: {
          notIn: answeredIds,
        },
      },
      include: ACTIVITY_INCLUDE,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });

    return activities.map((a) => this.hideAnswers(a));
  }

  async findGuestActivities(
    name: string,
    gradeGroup: GradeGroup,
    grade: Grade,
  ) {
    name = name.trim();
    if (!name) {
      throw new BadRequestException('Informe seu nome');
    }
    this.assertGuestGradeGroup(gradeGroup, grade);

    const submissions = await this.prisma.submission.findMany({
      where: {
        guestName: name,
        guestGradeGroup: gradeGroup,
        guestGrade: grade,
      },
      select: { activityId: true },
    });
    const answeredIds = submissions.map((submission) => submission.activityId);
    const studentProfile = {
      educationLevel: EducationLevel.ENSINO_FUNDAMENTAL,
      gradeGroup,
      grade,
      highSchoolYear: null,
    };
    const activities = await this.prisma.activity.findMany({
      where: {
        ...this.getStudentActivityFilter(studentProfile),
        id: { notIn: answeredIds },
      },
      include: ACTIVITY_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    return activities.map((activity) => this.hideAnswers(activity));
  }

  async findOneForGuest(id: string, gradeGroup: GradeGroup, grade: Grade) {
    this.assertGuestGradeGroup(gradeGroup, grade);
    const activity = await this.findOne(id);
    if (activity.status !== 'PUBLISHED') {
      throw new NotFoundException('Atividade não encontrada');
    }
    this.assertActivityMatchesStudent(activity, {
      educationLevel: EducationLevel.ENSINO_FUNDAMENTAL,
      gradeGroup,
      grade,
      highSchoolYear: null,
    });
    return this.hideAnswers(activity);
  }

  async findOneForUser(id: string, userId: string, userRole: string) {
    const activity = await this.findOne(id);

    if (userRole === Role.PROFESSOR) {
      if (activity.professorId !== userId) {
        throw new ForbiddenException('Você não tem permissão para ver esta atividade');
      }
      return activity;
    }

    if (activity.status !== 'PUBLISHED') {
      throw new NotFoundException('Atividade não encontrada');
    }

    const student = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        educationLevel: true,
        gradeGroup: true,
        grade: true,
        highSchoolYear: true,
      },
    });
    if (
      !student ||
      student.educationLevel === null ||
      student.gradeGroup === null
    ) {
      throw new BadRequestException('O perfil do aluno não possui etapa e ano escolar');
    }
    this.assertActivityMatchesStudent(activity, {
      educationLevel: student.educationLevel,
      gradeGroup: student.gradeGroup,
      grade: student.grade,
      highSchoolYear: student.highSchoolYear,
    });

    return this.hideAnswers(activity);
  }

  private getStudentActivityFilter(student: {
    educationLevel: EducationLevel;
    gradeGroup: GradeGroup;
    grade: Grade | null;
    highSchoolYear: HighSchoolGrade | null;
  }): Prisma.ActivityWhereInput {
    const yearFilter = student.grade
      ? { OR: [{ grade: student.grade }, { grade: null }] }
      : {
          OR: [
            { highSchoolYear: student.highSchoolYear },
            { highSchoolYear: null },
          ],
        };

    return {
      status: 'PUBLISHED',
      educationLevel: student.educationLevel,
      OR: [
        { gradeGroup: null, ...yearFilter },
        { gradeGroup: student.gradeGroup, ...yearFilter },
      ],
    };
  }

  private assertActivityMatchesStudent(
    activity: ActivityWithRelations,
    student: {
      educationLevel: EducationLevel;
      gradeGroup: GradeGroup;
      grade: Grade | null;
      highSchoolYear: HighSchoolGrade | null;
    },
  ) {
    const matchesEducation = activity.educationLevel === student.educationLevel;
    const matchesGroup =
      activity.gradeGroup === null || activity.gradeGroup === student.gradeGroup;
    const matchesYear =
      student.grade
        ? activity.grade === null || activity.grade === student.grade
        : activity.highSchoolYear === null ||
          activity.highSchoolYear === student.highSchoolYear;

    if (!matchesEducation || !matchesGroup || !matchesYear) {
      throw new NotFoundException('Atividade não encontrada');
    }
  }

  async findOne(id: string): Promise<ActivityWithRelations> {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: ACTIVITY_INCLUDE,
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada');
    }

    return activity;
  }

  async update(
    id: string,
    professorId: string,
    dto: UpdateActivityDTO,
  ) {
    const activity = await this.findOne(id);

    if (activity.professorId !== professorId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta atividade',
      );
    }

    this.logger.log(`Atualizando atividade ${id}`);

    this.assertValidAnswers(dto.questions);

    const updatedData: Prisma.ActivityUpdateInput = {
      title: dto.title || activity.title,
      description: dto.description || activity.description,
    };

    if (dto.questions) {
      updatedData.questions = {
        deleteMany: {},
        create: this.toQuestionData(dto.questions),
      };
    }

    if (dto.media) {
      updatedData.media = {
        deleteMany: {},
        create: this.toMediaData(dto.media),
      };
    }

    if (dto.grid && activity.wordSearch) {
      updatedData.wordSearch = {
        update: {
          grid: dto.grid,
          words: dto.words || [],
          orientation: dto.orientation || [],
          positions: dto.positions || [],
        },
      };
    }

    return await this.prisma.activity.update({
      where: { id },
      data: updatedData,
      include: ACTIVITY_INCLUDE,
    });
  }

  async delete(id: string, professorId: string) {
    const activity = await this.findOne(id);

    if (activity.professorId !== professorId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta atividade',
      );
    }

    this.logger.log(`Deletando atividade ${id}`);

    return await this.prisma.activity.delete({
      where: { id },
    });
  }

  async submit(
    activityId: string,
    studentId: string,
    dto: SubmitActivityDTO,
  ) {
    const exists = await this.prisma.submission.findFirst({
      where: {
        activityId,
        studentId,
      },
    });

    if (exists) {
      throw new BadRequestException('Você já respondeu esta atividade.');
    }

    const activity = await this.findOne(activityId);

    if (activity.status !== 'PUBLISHED') {
      throw new BadRequestException('Atividade não está publicada');
    }

    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: {
        educationLevel: true,
        gradeGroup: true,
        grade: true,
        highSchoolYear: true,
      },
    });
    if (
      !student ||
      student.educationLevel === null ||
      student.gradeGroup === null
    ) {
      throw new BadRequestException('O perfil do aluno não possui etapa e ano escolar');
    }
    this.assertActivityMatchesStudent(activity, {
      educationLevel: student.educationLevel,
      gradeGroup: student.gradeGroup,
      grade: student.grade,
      highSchoolYear: student.highSchoolYear,
    });

    this.logger.log(
      `Aluno ${studentId} submetendo resposta para atividade ${activityId}`,
    );

    return this.submitAnswers(activity, dto, { studentId });
  }

  async submitGuest(activityId: string, dto: GuestSubmitActivityDTO) {
    const name = dto.name.trim();
    if (!name) {
      throw new BadRequestException('Informe seu nome');
    }
    this.assertGuestGradeGroup(dto.gradeGroup, dto.grade);

    const exists = await this.prisma.submission.findFirst({
      where: {
        activityId,
        guestName: name,
        guestGradeGroup: dto.gradeGroup,
        guestGrade: dto.grade,
      },
    });
    if (exists) {
      throw new BadRequestException(
        'Esta atividade já foi respondida com este nome e ano escolar.',
      );
    }

    const activity = await this.findOne(activityId);
    if (activity.status !== 'PUBLISHED') {
      throw new BadRequestException('Atividade não está publicada');
    }
    this.assertActivityMatchesStudent(activity, {
      educationLevel: EducationLevel.ENSINO_FUNDAMENTAL,
      gradeGroup: dto.gradeGroup,
      grade: dto.grade,
      highSchoolYear: null,
    });

    this.logger.log(
      `Aluno convidado ${name} (${dto.grade}) submetendo atividade ${activityId}`,
    );

    return this.submitAnswers(activity, dto, {
      guestName: name,
      guestGradeGroup: dto.gradeGroup,
      guestGrade: dto.grade,
    });
  }

  private assertGuestGradeGroup(gradeGroup: GradeGroup, grade: Grade) {
    if (gradeGroup === GradeGroup.ENSINO_MEDIO) {
      throw new BadRequestException(
        'Alunos sem login devem selecionar anos iniciais ou anos finais',
      );
    }
    const initialGrades: Grade[] = [
      Grade.PRIMEIRO_ANO,
      Grade.SEGUNDO_ANO,
      Grade.TERCEIRO_ANO,
      Grade.QUARTO_ANO,
      Grade.QUINTO_ANO,
    ];
    const belongsToGroup =
      gradeGroup === GradeGroup.ANOS_INICIAIS
        ? initialGrades.includes(grade)
        : gradeGroup === GradeGroup.ANOS_FINAIS &&
          !initialGrades.includes(grade);

    if (!belongsToGroup) {
      throw new BadRequestException(
        'O ano informado não corresponde aos anos iniciais ou finais selecionados',
      );
    }
  }

  private submitAnswers(
    activity: ActivityWithRelations,
    dto: SubmitActivityDTO,
    identity:
      | { studentId: string }
      | {
          guestName: string;
          guestGradeGroup: GradeGroup;
          guestGrade: Grade;
        },
  ) {
    if (activity.type === ActivityType.MULTIPLE_CHOICE) {
      return this.submitMultipleChoice(activity, identity, dto.answers || []);
    } else if (activity.type === ActivityType.WORD_SEARCH) {
      return this.submitWordSearch(activity, identity, dto.foundWords || []);
    }

    throw new BadRequestException('Tipo de atividade não suportado');
  }

  private async submitMultipleChoice(
    activity: ActivityWithRelations,
    identity:
      | { studentId: string }
      | {
          guestName: string;
          guestGradeGroup: GradeGroup;
          guestGrade: Grade;
        },
    answers: number[],
  ) {
    if (answers.length !== activity.questions.length) {
      throw new BadRequestException('Número de respostas inválido');
    }

    let score = 0;

    activity.questions.forEach((q: any, index: number) => {
      if (answers[index] === q.answer) {
        score++;
      }
    });

    return await this.prisma.submission.create({
      data: {
        activityId: activity.id,
        answers,
        score,
        ...identity,
      },
    });
  }

  private async submitWordSearch(
    activity: ActivityWithRelations,
    identity:
      | { studentId: string }
      | {
          guestName: string;
          guestGradeGroup: GradeGroup;
          guestGrade: Grade;
        },
    foundWords: string[],
  ) {
    const wordSearch = activity.wordSearch;

    if (!wordSearch) {
      throw new BadRequestException('Atividade de caça palavras inválida');
    }

    let score = 0;
    foundWords.forEach((word) => {
      if (wordSearch.words.includes(word)) {
        score++;
      }
    });

    const maxScore = wordSearch.words.length;

    return await this.prisma.submission.create({
      data: {
        activityId: activity.id,
        foundWords,
        score: Math.round((score / maxScore) * 100),
        ...identity,
      },
    });
  }

  async publishActivity(id: string, professorId: string) {
    const activity = await this.findOne(id);

    if (activity.professorId !== professorId) {
      throw new ForbiddenException(
        'Você não tem permissão para publicar esta atividade',
      );
    }

    this.logger.log(`Publicando atividade ${id}`);

    return await this.prisma.activity.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async getStudentResults(studentId: string, skip = 0, take = 10) {
    return await this.prisma.submission.findMany({
      where: {
        studentId,
      },
      include: {
        activity: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  }

  async getProfessorResults(professorId: string, skip = 0, take = 10) {
    return await this.prisma.submission.findMany({
      where: {
        activity: {
          professorId,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            gradeGroup: true,
            grade: true,
            highSchoolYear: true,
          },
        },
        activity: {
          include: ACTIVITY_INCLUDE,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  }

  async correctSubmission(
    id: string,
    professorId: string,
    dto: CorrectSubmissionDTO,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: { activity: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission não encontrada');
    }

    if (submission.activity.professorId !== professorId) {
      throw new ForbiddenException(
        'Você não tem permissão para corrigir este submission',
      );
    }

    this.logger.log(`Corrigindo submission ${id}`);

    return await this.prisma.submission.update({
      where: { id },
      data: {
        score: dto.score,
        feedback: dto.feedback,
        status: 'CORRECTED',
        correctedAt: new Date(),
      },
    });
  }

  private toMediaData(media?: ActivityMediaDTO[]) {
    return (media || []).map((m, index) => ({
      type: m.type,
      url: m.url,
      caption: m.caption || null,
      mimeType: m.mimeType || null,
      order: index,
    }));
  }

  private toQuestionData(questions?: CreateQuestionDTO[]) {
    return (questions || []).map((q) => ({
      statement: q.statement,
      options: q.options,
      answer: q.answer,
      imageUrl: q.imageUrl || null,
      audioUrl: q.audioUrl || null,
    }));
  }

  private assertValidAnswers(questions?: CreateQuestionDTO[]) {
    questions?.forEach((q, index) => {
      if (q.answer >= q.options.length) {
        throw new BadRequestException(
          `Questão ${index + 1}: a resposta correta deve ser uma das alternativas`,
        );
      }
    });
  }

  // Remove o gabarito antes de enviar a atividade para alunos
  private hideAnswers(activity: ActivityWithRelations) {
    return {
      ...activity,
      questions: activity.questions.map(({ answer: _answer, ...q }) => q),
    };
  }
}
