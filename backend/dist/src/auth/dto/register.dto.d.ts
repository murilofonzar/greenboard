import { EducationLevel, Grade, HighSchoolGrade } from '@prisma/client';
export declare const normalizeEmail: ({ value }: {
    value: unknown;
}) => unknown;
declare class BaseRegisterDTO {
    name: string;
    email: string;
    password: string;
    birthDate: string;
}
export declare class RegisterStudentDTO extends BaseRegisterDTO {
    educationLevel: EducationLevel;
    grade?: Grade;
    highSchoolYear?: HighSchoolGrade;
}
export declare class RegisterProfessorDTO extends BaseRegisterDTO {
    accessCode?: string;
}
export {};
