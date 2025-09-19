import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { IAuthJwtPayload } from 'src/interfaces/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshJwtConfiguration: ConfigType<
      typeof refreshJwtConfig
    >,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException();

    const isPassword = await compare(password, user.password);
    if (!isPassword) throw new UnauthorizedException();

    return { id: user?.id };
  }

  async login(userId: string) {
    const payload: IAuthJwtPayload = { sub: userId };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      payload,
      this.refreshJwtConfiguration,
    );

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string) {
    const payload: IAuthJwtPayload = { sub: userId };
    const accessToken = this.jwtService.sign(payload);

    return {
      userId,
      accessToken,
    };
  }
}
