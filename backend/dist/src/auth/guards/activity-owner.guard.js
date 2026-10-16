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
exports.ActivityOwnerGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ActivityOwnerGuard = class ActivityOwnerGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const activityId = request.params.id;
        if (!activityId || !user) {
            throw new common_1.ForbiddenException('Não autorizado');
        }
        const activity = await this.prisma.activity.findUnique({
            where: { id: activityId },
        });
        if (!activity) {
            throw new common_1.NotFoundException('Atividade não encontrada');
        }
        if (activity.professorId !== user.sub) {
            throw new common_1.ForbiddenException('Você não tem permissão para editar atividades de outros professores');
        }
        request.activity = activity;
        return true;
    }
};
exports.ActivityOwnerGuard = ActivityOwnerGuard;
exports.ActivityOwnerGuard = ActivityOwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivityOwnerGuard);
//# sourceMappingURL=activity-owner.guard.js.map