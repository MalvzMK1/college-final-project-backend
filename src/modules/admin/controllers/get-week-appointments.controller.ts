import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { CurrentUser, RequireRoles } from "src/shared/decorators";
import { UserTypesEnum } from "src/shared/enum";
import { HttpResponse } from "src/shared/types";
import { GetWeekAppointmentsQueryParamsDTO } from "../dto/query-params/get-week-appointments-query-params.dto";
import { GetWeekAppointmentsOutputDTO } from "../dto/io/get-week-appointments-output.dto";
import { GetWeekAppointmentsService } from "../services/get-week-appointments.service";

@Controller()
@RequireRoles(UserTypesEnum.BARBER)
export class GetWeekAppointmentsController {
  constructor(private readonly getWeekAppointmentsService: GetWeekAppointmentsService) {}

  @Get('/appointment/week')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @CurrentUser('id') barberId: string,
    @Query() { date }: GetWeekAppointmentsQueryParamsDTO,
  ): Promise<HttpResponse<GetWeekAppointmentsOutputDTO[]>> {
    const data = await this.getWeekAppointmentsService.execute(barberId, date);

    return { data };
  }
}
