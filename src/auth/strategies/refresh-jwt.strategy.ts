import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import refreshConfig from '../../config/refresh-jwt.config';
import { IAuthJwtPayload } from 'src/interfaces/auth.interface';
import { REFRESH_JWT } from 'src/constants/auth.constant';

@Injectable()
export class RefreshJWTStrategy extends PassportStrategy(
  Strategy,
  REFRESH_JWT,
) {
  constructor(
    @Inject(refreshConfig.KEY)
    private readonly refreshJwtConfiguation: ConfigType<typeof refreshConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtConfiguation.secret as string,
    });
  }

  validate(payload: IAuthJwtPayload) {
    return { id: payload.sub };
  }
}
