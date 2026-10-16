import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDTO, UpdateActivityDTO } from './dto/create-activity.dto';
import { SubmitActivityDTO, CorrectSubmissionDTO } from './dto/submit-activity.dto';
import { Prisma } from '@prisma/client';
declare const ACTIVITY_INCLUDE: {
    questions: true;
    wordSearch: true;
    media: {
        orderBy: {
            order: "asc";
        };
    };
};
type ActivityWithRelations = Prisma.ActivityGetPayload<{
    include: typeof ACTIVITY_INCLUDE;
}>;
export declare class ActivitiesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(dto: CreateActivityDTO, professorId: string): Promise<{
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
    findAll(userId: string, userRole: string, skip?: number, take?: number): Promise<{
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
    findOneForUser(id: string, userId: string, userRole: string): Promise<{
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
    findOne(id: string): Promise<ActivityWithRelations>;
    update(id: string, professorId: string, dto: UpdateActivityDTO): Promise<{
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
    delete(id: string, professorId: string): Promise<{
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
    submit(activityId: string, studentId: string, dto: SubmitActivityDTO): Promise<{
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
    private submitMultipleChoice;
    private submitWordSearch;
    publishActivity(id: string, professorId: string): Promise<{
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
    getStudentResults(studentId: string, skip?: number, take?: number): Promise<({
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
    getProfessorResults(professorId: string, skip?: number, take?: number): Promise<({
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
    correctSubmission(id: string, professorId: string, dto: CorrectSubmissionDTO): Promise<{
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
    private toMediaData;
    private toQuestionData;
    private assertValidAnswers;
    private hideAnswers;
}
export {};
