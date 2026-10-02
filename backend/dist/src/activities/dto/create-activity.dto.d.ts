import { EducationLevel, GradeGroup, Grade, HighSchoolGrade, ActivityType, MediaType } from '@prisma/client';
export declare const MEDIA_URL_REGEX: RegExp;
export declare class ActivityMediaDTO {
    type: MediaType;
    url: string;
    caption?: string;
    mimeType?: string;
}
export declare class CreateQuestionDTO {
    statement: string;
    options: string[];
    answer: number;
    imageUrl?: string;
    audioUrl?: string;
}
export declare class CreateActivityDTO {
    title: string;
    description: string;
    type: ActivityType;
    educationLevel: EducationLevel;
    gradeGroup?: GradeGroup;
    grade?: Grade;
    highSchoolYear?: HighSchoolGrade;
    media?: ActivityMediaDTO[];
    questions?: CreateQuestionDTO[];
    grid?: string[];
    words?: string[];
    orientation?: string[];
    positions?: string[];
}
export declare class UpdateActivityDTO {
    title?: string;
    description?: string;
    media?: ActivityMediaDTO[];
    questions?: CreateQuestionDTO[];
    grid?: string[];
    words?: string[];
    orientation?: string[];
    positions?: string[];
}
