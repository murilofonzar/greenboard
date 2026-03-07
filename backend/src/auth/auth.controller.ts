import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: any) {
    return this.service.register(body);
  }

  @Public()
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.service.login(body.email, body.password);
  }
}