import { Module } from "@nestjs/common";
import { GetAvailableHoursController } from "./controllers/get-available-hours.controller";
import { GetAvailableHoursService } from "./services/get-available-hours.service";
import { CreateAppointmentController } from "./controllers/create-appointment.controller";
import { CreateAppointmentService } from "./services/create-appointment.service";
import { DatabaseModule } from "src/shared";
import { FindLastAppointmentsController } from "./controllers/find-last-appointments.controller";
import { FindLastAppointmentsService } from "./services/find-last-appointments.service";

@Module({
  imports: [DatabaseModule],
  controllers: [GetAvailableHoursController, CreateAppointmentController, FindLastAppointmentsController],
  providers: [GetAvailableHoursService, CreateAppointmentService, FindLastAppointmentsService],
})
export class CustomerModule {}
