import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    register(body: any): Promise<{
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
    login(body: {
        email: string;
        password: string;
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
}
