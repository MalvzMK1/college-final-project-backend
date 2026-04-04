import { Module } from "@nestjs/common";
import { TurnIntoBarberController } from "./controllers/turn-into-barber.controller";
import { TurnIntoBarberService } from "./services/turn-into-barber.service";
import { GetAllUsersController } from "./controllers/get-all-users.controller";
import { GetAllUsersService } from "./services/get-all-users.service";

@Module({
  controllers: [TurnIntoBarberController, GetAllUsersController],
  providers: [TurnIntoBarberService, GetAllUsersService],
})
export class AdminModule {}
