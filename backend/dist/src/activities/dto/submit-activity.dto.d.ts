import { Grade, GradeGroup } from '@prisma/client';
export declare class SubmitActivityDTO {
    answers?: number[];
    foundWords?: string[];
}
export declare class GuestSubmitActivityDTO extends SubmitActivityDTO {
    name: string;
    gradeGroup: GradeGroup;
    grade: Grade;
}
declare const GuestActivityQueryDTO_base: import("@nestjs/common").Type<Omit<GuestSubmitActivityDTO, "answers" | "foundWords">>;
export declare class GuestActivityQueryDTO extends GuestActivityQueryDTO_base {
}
export declare class CorrectSubmissionDTO {
    score: number;
    feedback: string;
}
export {};
