import { Module } from '@nestjs/common';
import { DatabaseModule, RedisModule } from './shared'
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AuthenticationGuard, AuthorizationGuard } from './shared/guards';
import { LoggerInterceptor } from './shared/interceptors';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { CustomerModule } from './modules/customer/customer.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
          },
        };
      },
    }),

    AuthModule,
    AdminModule,
    CustomerModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'customer',
        module: CustomerModule,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
