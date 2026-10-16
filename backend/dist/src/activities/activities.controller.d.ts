import { ActivitiesService } from './activities.service';
import { CreateActivityDTO, UpdateActivityDTO } from './dto/create-activity.dto';
import { SubmitActivityDTO, CorrectSubmissionDTO } from './dto/submit-activity.dto';
import { PaginationQueryDTO } from '../common/dto/pagination-query.dto';
export declare class ActivitiesController {
    private readonly service;
    constructor(service: ActivitiesService);
    create(dto: CreateActivityDTO, req: any): Promise<{
        questions: {
            id: string;
            statement: string;
            options: string[];
            answer: number;
            imageUrl: string | null;
            audioUrl: string | null;
            activityId: string;
        }[];
        wordSearch: {
            id: string;
            createdAt: Date;
            grid: string[];
            words: string[];
            orientation: string[];
            positions: string[];
            activityId: string;
        } | null;
        media: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.MediaType;
            activityId: string;
            url: string;
            caption: string | null;
            mimeType: string | null;
            order: number;
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
        type: import(".prisma/client").$Enums.ActivityType;
        status: import(".prisma/client").$Enums.ActivityStatus;
        updatedAt: Date;
        professorId: string;
    }>;
    findAll(req: any, query: PaginationQueryDTO): Promise<{
        questions: {
            id: string;
            statement: string;
            options: string[];
            imageUrl: string | null;
            audioUrl: string | null;
            activityId: string;
        }[];
        wordSearch: {
            id: string;
            createdAt: Date;
            grid: string[];
            words: string[];
            orientation: string[];
            positions: string[];
            activityId: string;
        } | null;
        media: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.MediaType;
            activityId: string;
            url: string;
            caption: string | null;
            mimeType: string | null;
            order: number;
        }[];
        id: string;
        educationLevel: import(".prisma/client").$Enums.EducationLevel;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        type: import(".prisma/client").$Enums.ActivityType;
        status: import(".prisma/client").$Enums.ActivityStatus;
        updatedAt: Date;
        professorId: string;
    }[]>;
    studentResults(req: any, query: PaginationQueryDTO): Promise<({
        activity: {
            id: string;
            educationLevel: import(".prisma/client").$Enums.EducationLevel;
            gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
            grade: import(".prisma/client").$Enums.Grade | null;
            highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
            createdAt: Date;
            title: string;
            description: string;
            type: import(".prisma/client").$Enums.ActivityType;
            status: import(".prisma/client").$Enums.ActivityStatus;
            updatedAt: Date;
            professorId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        answers: number[];
        foundWords: string[];
        score: number | null;
        feedback: string | null;
        correctedAt: Date | null;
        studentId: string;
        activityId: string;
    })[]>;
    professorResults(req: any, query: PaginationQueryDTO): Promise<({
        activity: {
            questions: {
                id: string;
                statement: string;
                options: string[];
                answer: number;
                imageUrl: string | null;
                audioUrl: string | null;
                activityId: string;
            }[];
            wordSearch: {
                id: string;
                createdAt: Date;
                grid: string[];
                words: string[];
                orientation: string[];
                positions: string[];
                activityId: string;
            } | null;
            media: {
                id: string;
                createdAt: Date;
                type: import(".prisma/client").$Enums.MediaType;
                activityId: string;
                url: string;
                caption: string | null;
                mimeType: string | null;
                order: number;
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
            type: import(".prisma/client").$Enums.ActivityType;
            status: import(".prisma/client").$Enums.ActivityStatus;
            updatedAt: Date;
            professorId: string;
        };
        student: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        answers: number[];
        foundWords: string[];
        score: number | null;
        feedback: string | null;
        correctedAt: Date | null;
        studentId: string;
        activityId: string;
    })[]>;
    getOne(id: string, req: any): Promise<{
        questions: {
            id: string;
            statement: string;
            options: string[];
            imageUrl: string | null;
            audioUrl: string | null;
            activityId: string;
        }[];
        wordSearch: {
            id: string;
            createdAt: Date;
            grid: string[];
            words: string[];
            orientation: string[];
            positions: string[];
            activityId: string;
        } | null;
        media: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.MediaType;
            activityId: string;
            url: string;
            caption: string | null;
            mimeType: string | null;
            order: number;
        }[];
        id: string;
        educationLevel: import(".prisma/client").$Enums.EducationLevel;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        type: import(".prisma/client").$Enums.ActivityType;
        status: import(".prisma/client").$Enums.ActivityStatus;
        updatedAt: Date;
        professorId: string;
    }>;
    update(id: string, dto: UpdateActivityDTO, req: any): Promise<{
        questions: {
            id: string;
            statement: string;
            options: string[];
            answer: number;
            imageUrl: string | null;
            audioUrl: string | null;
            activityId: string;
        }[];
        wordSearch: {
            id: string;
            createdAt: Date;
            grid: string[];
            words: string[];
            orientation: string[];
            positions: string[];
            activityId: string;
        } | null;
        media: {
            id: string;
            createdAt: Date;
            type: import(".prisma/client").$Enums.MediaType;
            activityId: string;
            url: string;
            caption: string | null;
            mimeType: string | null;
            order: number;
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
        type: import(".prisma/client").$Enums.ActivityType;
        status: import(".prisma/client").$Enums.ActivityStatus;
        updatedAt: Date;
        professorId: string;
    }>;
    delete(id: string, req: any): Promise<{
        id: string;
        educationLevel: import(".prisma/client").$Enums.EducationLevel;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        type: import(".prisma/client").$Enums.ActivityType;
        status: import(".prisma/client").$Enums.ActivityStatus;
        updatedAt: Date;
        professorId: string;
    }>;
    publish(id: string, req: any): Promise<{
        id: string;
        educationLevel: import(".prisma/client").$Enums.EducationLevel;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        createdAt: Date;
        title: string;
        description: string;
        type: import(".prisma/client").$Enums.ActivityType;
        status: import(".prisma/client").$Enums.ActivityStatus;
        updatedAt: Date;
        professorId: string;
    }>;
    submit(id: string, dto: SubmitActivityDTO, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        answers: number[];
        foundWords: string[];
        score: number | null;
        feedback: string | null;
        correctedAt: Date | null;
        studentId: string;
        activityId: string;
    } | undefined>;
    correct(id: string, body: CorrectSubmissionDTO, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        answers: number[];
        foundWords: string[];
        score: number | null;
        feedback: string | null;
        correctedAt: Date | null;
        studentId: string;
        activityId: string;
    }>;
}
