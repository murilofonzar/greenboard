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
        status: import(".prisma/client").$Enums.ActivityStatus;
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
        status: import(".prisma/client").$Enums.ActivityStatus;
        professorId: string;
    })[]>;
    submit(id: string, req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        activityId: string;
        answers: number[];
        score: number | null;
        feedback: string | null;
        correctedAt: Date | null;
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
            status: import(".prisma/client").$Enums.ActivityStatus;
            professorId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        activityId: string;
        answers: number[];
        score: number | null;
        feedback: string | null;
        correctedAt: Date | null;
    })[]>;
    professorResults(req: any): Promise<({
        activity: {
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
            status: import(".prisma/client").$Enums.ActivityStatus;
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
        status: import(".prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        activityId: string;
        answers: number[];
        score: number | null;
        feedback: string | null;
        correctedAt: Date | null;
    })[]>;
    correct(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        studentId: string;
        activityId: string;
        answers: number[];
        score: number | null;
        feedback: string | null;
        correctedAt: Date | null;
    }>;
    publish(id: string): Promise<{
        id: string;
        educationLevel: import(".prisma/client").$Enums.EducationLevel;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ActivityStatus;
        professorId: string;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        educationLevel: import(".prisma/client").$Enums.EducationLevel;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ActivityStatus;
        professorId: string;
    }>;
}
