import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EducationLevel, Grade, GradeGroup, HighSchoolGrade } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(data: {
        name: string;
        email: string;
        password: string;
        role: 'PROFESSOR' | 'ALUNO';
        birthDate: string;
        educationLevel?: EducationLevel;
        gradeGroup?: GradeGroup;
        grade?: Grade;
        highSchoolYear?: HighSchoolGrade;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            educationLevel: any;
            gradeGroup: any;
            grade: any;
            highSchoolYear: any;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            educationLevel: any;
            gradeGroup: any;
            grade: any;
            highSchoolYear: any;
        };
    }>;
    private sign;
}
