import { PrismaService } from '../prisma/prisma.service';
export declare class ActivitiesService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findAll(user: any): Promise<({
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
