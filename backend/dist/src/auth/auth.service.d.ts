import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterProfessorDTO, RegisterStudentDTO } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private readonly logger;
    constructor(prisma: PrismaService, jwt: JwtService);
    registerStudent(data: RegisterStudentDTO): Promise<{
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
    registerProfessor(data: RegisterProfessorDTO): Promise<{
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
    me(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        educationLevel: import(".prisma/client").$Enums.EducationLevel | null;
        gradeGroup: import(".prisma/client").$Enums.GradeGroup | null;
        grade: import(".prisma/client").$Enums.Grade | null;
        highSchoolYear: import(".prisma/client").$Enums.HighSchoolGrade | null;
    }>;
    private createUser;
    private resolveStudentAcademicData;
    private assertProfessorAccessCode;
    login(email: string, password: string): Promise<{
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
    refreshToken(refreshToken: string): Promise<{
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
    private sign;
    private toPublicUser;
}
