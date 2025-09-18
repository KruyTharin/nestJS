import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { IAuthJwtPayload } from 'src/interfaces/auth.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundException();

    const isPassword = await compare(password, user.password);
    if (!isPassword) throw new UnauthorizedException();

    return { id: user?.id };
  }

  async login(userId: string) {
    const payload: IAuthJwtPayload = { sub: userId };
    const token = this.jwtService.sign(payload);

    return token;
  }
}
