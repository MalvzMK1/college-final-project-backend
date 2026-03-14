import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private jwtAccessTokenSecret: string;
  private jwtAlgorithm: JwtSignOptions['algorithm'];

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtAccessTokenSecret = configService.get<string>('JWT_SECRET', 'super_secret_secret');
    this.jwtAlgorithm = configService.get<JwtSignOptions['algorithm']>('JWT_ALGORITHM', 'HS256');
  }

  public canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequest(request);

    return this.validateToken({
      request,
      token,
      requiresAuth: !isPublic
    } as ValidateTokenInput);
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const [type, token]: string[] = request.headers['authorization']?.split(' ') ?? ['', ''];

    return ['Bearer', 'API-Key'].includes(type.toLowerCase()) ? token : undefined;
  }

  private async validateToken({
    request,
    token,
    requiresAuth,
  }: ValidateTokenInput) : Promise<boolean> {
    if (!token) {
      if (requiresAuth) {
        throw new UnauthorizedException({ message: 'É necessário autenticar-se' });
      }
      
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        algorithms: [this.jwtAlgorithm!],
        secret: this.jwtAccessTokenSecret,
      });

      request['user'] = payload;
      request['userId'] = payload?.sub;
    } catch (error) {
      if (!requiresAuth) {
        return true;
      }

      throw new UnauthorizedException({ message: 'É necessário autenticar-se' });
    }

    return true;

  }
}

type ValidateTokenInput = {
  request: Request;
  requiresAuth: boolean;
} & (
  {
    token: string;
    requiresAuth: true;
  }
  | {
    token?: string;
    requiresAuth: false;
  }
)
