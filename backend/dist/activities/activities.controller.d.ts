import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly service;
    constructor(service: ActivitiesService);
    create(dto: any): import(".prisma/client").Prisma.Prisma__ActivityClient<{
        questions: {
            id: string;
            statement: string;
            options: string[];
            answer: number;
            activityId: string;
        }[];
    } & {
        id: string;
        educationLevel: import(".prisma/client").$Enums.EducationLevel;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        professorId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(req: any): Promise<({
        questions: {
            id: string;
            statement: string;
            options: string[];
            answer: number;
            activityId: string;
        }[];
    } & {
        id: string;
        educationLevel: import(".prisma/client").$Enums.EducationLevel;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        professorId: string;
    })[]>;
}
