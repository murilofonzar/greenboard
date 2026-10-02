import { EducationLevel, Grade, GradeGroup, HighSchoolGrade, Role } from '@prisma/client';
export declare class UserResponseDTO {
    id: string;
    name: string;
    email: string;
    role: Role;
    educationLevel: EducationLevel | null;
    gradeGroup: GradeGroup | null;
    grade: Grade | null;
    highSchoolYear: HighSchoolGrade | null;
}
export declare class AuthResponseDTO {
    access_token: string;
    refresh_token: string;
    user: UserResponseDTO;
}
