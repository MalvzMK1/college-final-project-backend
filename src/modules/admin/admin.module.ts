import { Module } from "@nestjs/common";
import { TurnIntoBarberController } from "./controllers/turn-into-barber.controller";
import { TurnIntoBarberService } from "./services/turn-into-barber.service";
import { GetAllUsersController } from "./controllers/get-all-users.controller";
import { GetAllUsersService } from "./services/get-all-users.service";
import { UpdateScheduleStatusController } from "./controllers/update-schedule-status.controller";
import { UpdateScheduleStatusService } from "./services/update-schedule-status.service";
import { GetWeekAppointmentsController } from "./controllers/get-week-appointments.controller";
import { GetWeekAppointmentsService } from "./services/get-week-appointments.service";
import { DatabaseModule } from "src/shared";

@Module({
  imports: [DatabaseModule],
  controllers: [
    TurnIntoBarberController,
    GetAllUsersController,
    UpdateScheduleStatusController,
    GetWeekAppointmentsController,
  ],
  providers: [
    TurnIntoBarberService,
    GetAllUsersService,
    UpdateScheduleStatusService,
    GetWeekAppointmentsService,
  ],
})
export class AdminModule {}
