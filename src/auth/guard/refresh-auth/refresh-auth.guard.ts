import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_JWT } from 'src/constants/auth.constant';

@Injectable()
export class RefreshAuthGuard extends AuthGuard(REFRESH_JWT) {}
