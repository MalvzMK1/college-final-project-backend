import { Module } from "@nestjs/common";
import { LoginController } from "./controllers/login.controller";
import { LoginService } from "./services/login.service";
import { DatabaseModule } from "src/shared";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [
    LoginController,
  ],
  providers: [
    LoginService,
  ],
})
export class AuthModule {}
