import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { HttpResponse } from "src/shared/types";
import { GetAvailableHoursOutputDTO } from "../dto/io/get-available-hours-output.dto";
import { GetAvailableHoursService } from "../services/get-available-hours.service";

@Controller()
export class GetAvailableHoursController {
  constructor(private readonly getAvailableHoursService: GetAvailableHoursService) {}

  @HttpCode(HttpStatus.OK)
  @Get('available-hours')
  public async handle(): Promise<HttpResponse<GetAvailableHoursOutputDTO>> {
    const data = await this.getAvailableHoursService.execute();

    return { data };
  }
}
