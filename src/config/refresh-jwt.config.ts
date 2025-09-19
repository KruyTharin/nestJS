import { JwtSignOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';
import { REFRESH_JWT } from 'src/constants/auth.constant';

export default registerAs(
  REFRESH_JWT,
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_TOKEN,
    expiresIn: process.env.REFRESH_JWT_EXPIRE_IN,
  }),
);
