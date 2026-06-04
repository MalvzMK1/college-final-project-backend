import { Controller, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { UserTypesEnum } from "src/shared";
import { CurrentUser, RequireRoles } from "src/shared/decorators";
import { AuthenticatedUser, HttpResponse } from "src/shared/types";
import { CancelAppointmentRouteParamsDTO } from "../dto/route-params/cancel-appointment-route-params.dto";
import { CancelAppointmentService } from "../services/cancel-appointment.service";

@Controller()
@RequireRoles(UserTypesEnum.CUSTOMER)
export class CancelAppointmentController {
  constructor(private readonly cancelAppointmentService: CancelAppointmentService) {}

  @Patch('appointment/:appointmentId/cancel')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @Param() { appointmentId }: CancelAppointmentRouteParamsDTO,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<HttpResponse> {
    await this.cancelAppointmentService.execute(appointmentId, user);

    return { message: 'Agendamento cancelado com sucesso' };
  }
}
