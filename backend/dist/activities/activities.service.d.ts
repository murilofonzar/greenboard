import { PrismaService } from '../prisma/prisma.service';
export declare class ActivitiesService {
    private prisma;
    constructor(prisma: PrismaService);
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
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        professorId: string;
    })[]>;
    submit(activityId: string, studentId: string, answers: number[]): Promise<{
        id: string;
        createdAt: Date;
        activityId: string;
        studentId: string;
        answers: number[];
        score: number;
    }>;
    getStudentResults(studentId: string): Promise<({
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
    getProfessorResults(professorId: string): Promise<({
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
