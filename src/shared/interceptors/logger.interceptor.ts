import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    this.logger.assign({
      controllerName,
      handlerName,
      ...(request.userId ? { userId: request.userId } : {}),
    });

    return next.handle();
  }
}
