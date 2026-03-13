import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthenticatedUser } from "../types";
import { IS_PUBLIC_KEY, ROLES_KEY } from "../decorators";
import { UserTypesEnum } from "../enum";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const contextHandler = context.getHandler();
    const contextClass = context.getClass();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      contextHandler,
      contextClass,
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<UserTypesEnum[]>(ROLES_KEY, [
      contextHandler,
      contextClass,
    ]);
    if (!roles?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (roles.includes(user?.roleId)) return true

    throw new ForbiddenException('Sem permissão');
  }
}
