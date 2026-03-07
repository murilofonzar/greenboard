import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly service;
    constructor(service: ActivitiesService);
    create(dto: any): import(".prisma/client").Prisma.Prisma__ActivityClient<{
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        professorId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        questions: {
            id: string;
            statement: string;
            options: string[];
            answer: number;
            activityId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        professorId: string;
    })[]>;
}
