import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JWTStrategy } from './strategies/jwt.strategy';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { RefreshJWTStrategy } from './strategies/refresh-jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JWTStrategy, RefreshJWTStrategy],
})
export class AuthModule {}
