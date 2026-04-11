import { Module } from "@nestjs/common";
import { GetAvailableHoursController } from "./controllers/get-available-hours.controller";
import { GetAvailableHoursService } from "./services/get-available-hours.service";
import { CreateAppointmentController } from "./controllers/create-appointment.controller";
import { CreateAppointmentService } from "./services/create-appointment.service";
import { DatabaseModule } from "src/shared";

@Module({
  imports: [DatabaseModule],
  controllers: [GetAvailableHoursController, CreateAppointmentController],
  providers: [GetAvailableHoursService, CreateAppointmentService],
})
export class CustomerModule {}
