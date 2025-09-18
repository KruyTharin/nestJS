import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/config/jwt.config';
import { IAuthJwtPayload } from 'src/interfaces/auth.interface';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguation: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguation.secret as string,
    });
  }

  validate(payload: IAuthJwtPayload) {
    return { id: payload.sub };
  }
}
