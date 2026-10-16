import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getJwtSecret } from './jwt-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: any) {
    if (payload.type === 'refresh') {
      throw new UnauthorizedException('Refresh token não pode ser usado como access token');
    }

    return {
      sub: payload.sub,
      id: payload.sub,
      role: payload.role,
      educationLevel: payload.educationLevel,
      grade: payload.grade,
      highSchoolYear: payload.highSchoolYear,
    };
  }
}