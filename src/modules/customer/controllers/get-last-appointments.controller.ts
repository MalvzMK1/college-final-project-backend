import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { UserTypesEnum } from "src/shared";
import { CurrentUser, RequireRoles } from "src/shared/decorators";
import { HttpResponse, AuthenticatedUser } from "src/shared/types";
import { GetLastAppointmentsOutputDTO } from "../dto/io/get-last-appointments-output.dto";
import { GetLastAppointmentsService } from "../services/get-last-appointments.service";

@Controller()
@RequireRoles(UserTypesEnum.CUSTOMER)
export class GetLastAppointmentsController { 
  constructor(private readonly getLastAppointmentsService: GetLastAppointmentsService) {}

  @Get('appointment/last')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<HttpResponse<GetLastAppointmentsOutputDTO>> {
    const data = await this.getLastAppointmentsService.execute(user);
    return { data };
  }
}
