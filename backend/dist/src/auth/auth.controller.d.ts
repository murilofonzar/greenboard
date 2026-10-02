import { AuthService } from './auth.service';
import { RegisterProfessorDTO, RegisterStudentDTO } from './dto/register.dto';
import { LoginDTO, RefreshTokenDTO } from './dto/login.dto';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    registerStudent(body: RegisterStudentDTO): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            educationLevel: import(".prisma/client").$Enums.EducationLevel | null;
            gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
            grade: import(".prisma/client").$Enums.Grade | null;
            highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        };
    }>;
    registerProfessor(body: RegisterProfessorDTO): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            educationLevel: import(".prisma/client").$Enums.EducationLevel | null;
            gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
            grade: import(".prisma/client").$Enums.Grade | null;
            highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        };
    }>;
    login(body: LoginDTO): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            educationLevel: import(".prisma/client").$Enums.EducationLevel | null;
            gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
            grade: import(".prisma/client").$Enums.Grade | null;
            highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        };
    }>;
    refresh(body: RefreshTokenDTO): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            educationLevel: import(".prisma/client").$Enums.EducationLevel | null;
            gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
            grade: import(".prisma/client").$Enums.Grade | null;
            highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
        };
    }>;
    me(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        educationLevel: import(".prisma/client").$Enums.EducationLevel | null;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
    }>;
}
