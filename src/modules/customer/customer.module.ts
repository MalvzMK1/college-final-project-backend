import { Module } from "@nestjs/common";
import { GetAvailableHoursController } from "./controllers/get-available-hours.controller";
import { GetAvailableHoursService } from "./services/get-available-hours.service";
import { CreateAppointmentController } from "./controllers/create-appointment.controller";
import { CreateAppointmentService } from "./services/create-appointment.service";
import { DatabaseModule } from "src/shared";
import { GetLastAppointmentsController } from "./controllers/get-last-appointments.controller";
import { GetLastAppointmentsService } from "./services/get-last-appointments.service";

@Module({
  imports: [DatabaseModule],
  controllers: [GetAvailableHoursController, CreateAppointmentController, GetLastAppointmentsController],
  providers: [GetAvailableHoursService, CreateAppointmentService, GetLastAppointmentsService],
})
export class CustomerModule {}
