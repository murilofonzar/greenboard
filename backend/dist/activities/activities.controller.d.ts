import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly service;
    constructor(service: ActivitiesService);
    create(dto: any): Promise<{
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
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        professorId: string;
    }>;
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
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        professorId: string;
    })[]>;
    submit(id: string, req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        activityId: string;
        studentId: string;
        answers: number[];
        score: number;
    }>;
    studentResults(req: any): Promise<({
        activity: {
            id: string;
            educationLevel: import(".prisma/client").$Enums.EducationLevel;
            gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
            grade: import(".prisma/client").$Enums.Grade | null;
            highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
            createdAt: Date;
            title: string;
            description: string;
            professorId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        activityId: string;
        studentId: string;
        answers: number[];
        score: number;
    })[]>;
    professorResults(req: any): Promise<({
        activity: {
            id: string;
            educationLevel: import(".prisma/client").$Enums.EducationLevel;
            gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
            grade: import(".prisma/client").$Enums.Grade | null;
            highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
            createdAt: Date;
            title: string;
            description: string;
            professorId: string;
        };
        student: {
            id: string;
            email: string;
            name: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            birthDate: Date;
            educationLevel: import(".prisma/client").$Enums.EducationLevel | null;
            gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
            grade: import(".prisma/client").$Enums.Grade | null;
            highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        activityId: string;
        studentId: string;
        answers: number[];
        score: number;
    })[]>;
}
