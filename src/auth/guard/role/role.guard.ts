import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from 'src/decorators/role.descorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(), // check on specific route on controller
      context.getClass(), // check on entire route on controller
    ]); // this is from metadata the passed by decorator

    const user = context.switchToHttp().getRequest().user; // from jwt guard
    const requiredRole = requiredRoles.some((role) => user.role === role);

    return requiredRole;
  }
}
