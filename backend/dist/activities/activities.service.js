"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActivitiesService = class ActivitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
    async findAll(user) {
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
    async submit(activityId, studentId, answers) {
        const exists = await this.prisma.submission.findFirst({
            where: {
                activityId,
                studentId,
            },
        });
        if (exists) {
            throw new common_1.BadRequestException('Você já respondeu esta atividade.');
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
            throw new common_1.NotFoundException('Atividade não encontrada');
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
    async publishActivity(id) {
        return this.prisma.activity.update({
            where: {
                id,
            },
            data: {
                status: 'PUBLISHED',
            },
        });
    }
    async getStudentResults(studentId) {
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
    async correctSubmission(submissionId, score, feedback) {
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
    async getProfessorResults(professorId) {
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
    async updateActivity(id, dto) {
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
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map