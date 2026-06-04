import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { UserTypesEnum } from "src/shared";
import { CurrentUser, RequireRoles } from "src/shared/decorators";
import { HttpResponse, AuthenticatedUser } from "src/shared/types";
import { FindLastAppointmentsOutputDTO } from "../dto/io/find-last-appointments-output.dto";
import { FindLastAppointmentsService } from "../services/find-last-appointments.service";

@Controller()
@RequireRoles(UserTypesEnum.CUSTOMER)
export class FindLastAppointmentsController { 
  constructor(private readonly findLastAppointmentsService: FindLastAppointmentsService) {}

  @Get('appointment/last')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<HttpResponse<FindLastAppointmentsOutputDTO>> {
    const data = await this.findLastAppointmentsService.execute(user);
    return { data };
  }
}
