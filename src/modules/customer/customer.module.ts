import { Module } from "@nestjs/common";
import { GetAvailableHoursController } from "./controllers/get-available-hours.controller";
import { GetAvailableHoursService } from "./services/get-available-hours.service";
import { CreateAppointmentController } from "./controllers/create-appointment.controller";
import { CreateAppointmentService } from "./services/create-appointment.service";
import { DatabaseModule } from "src/shared";
import { GetLastAppointmentsController } from "./controllers/get-last-appointments.controller";
import { GetLastAppointmentsService } from "./services/get-last-appointments.service";
import { CancelAppointmentController } from "./controllers/cancel-appointment.controller";
import { CancelAppointmentService } from "./services/cancel-appointment.service";

@Module({
  imports: [DatabaseModule],
  controllers: [
    GetAvailableHoursController,
    CreateAppointmentController,
    GetLastAppointmentsController,
    CancelAppointmentController,
  ],
  providers: [
    GetAvailableHoursService,
    CreateAppointmentService,
    GetLastAppointmentsService,
    CancelAppointmentService,
  ],
})
export class CustomerModule {}
