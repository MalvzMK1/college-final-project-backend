import { Body, Controller, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { CurrentUser, RequireRoles } from "src/shared/decorators";
import { UserTypesEnum } from "src/shared/enum";
import { HttpResponse } from "src/shared/types";
import { UpdateAppointmentStatusRouteParamsDTO } from "../dto/route-params/update-appointment-status-route-params.dto";
import { UpdateAppointmentStatusBodyDTO } from "../dto/io/update-appointment-status-body.dto";
import { UpdateScheduleStatusService } from "../services/update-schedule-status.service";

@Controller()
@RequireRoles(UserTypesEnum.BARBER)
export class UpdateScheduleStatusController {
  constructor(private readonly updateScheduleStatusService: UpdateScheduleStatusService) {}

  @Patch('/appointment/:appointmentId/status')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @CurrentUser('id') barberId: string,
    @Param() { appointmentId }: UpdateAppointmentStatusRouteParamsDTO,
    @Body() { statusId }: UpdateAppointmentStatusBodyDTO,
  ): Promise<HttpResponse> {
    await this.updateScheduleStatusService.execute({ barberId, appointmentId, statusId });

    return { message: 'Status do agendamento atualizado com sucesso' };
  }
}
