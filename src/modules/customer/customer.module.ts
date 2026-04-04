import { Module } from "@nestjs/common";
import { GetAvailableHoursController } from "./controllers/get-available-hours.controller";
import { GetAvailableHoursService } from "./services/get-available-hours.service";

@Module({
  controllers: [GetAvailableHoursController],
  providers: [GetAvailableHoursService],
})
export class CustomerModule {}
