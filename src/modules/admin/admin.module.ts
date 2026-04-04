import { Module } from "@nestjs/common";
import { TurnIntoBarberController } from "./controllers/turn-into-barber.controller";
import { TurnIntoBarberService } from "./services/turn-into-barber.service";

@Module({
  controllers: [TurnIntoBarberController],
  providers: [TurnIntoBarberService],
})
export class AdminModule {}
