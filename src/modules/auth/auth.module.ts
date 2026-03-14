import { Module } from "@nestjs/common";
import { LoginController } from "./controllers/login.controller";
import { LoginService } from "./services/login.service";
import { DatabaseModule } from "src/shared";
import { JwtModule } from "@nestjs/jwt";
import { RegisterController } from "./controllers/register.controller";
import { RegisterService } from "./services/register.service";

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [
    LoginController,
    RegisterController,
  ],
  providers: [
    LoginService,
    RegisterService,
  ],
})
export class AuthModule {}
