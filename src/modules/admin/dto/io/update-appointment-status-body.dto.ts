import { IsEnum, IsNotEmpty } from "class-validator";
import { AppointmentStatusEnum } from "src/shared/enum/appointment-status.enum";

export class UpdateAppointmentStatusBodyDTO {
  @IsNotEmpty()
  @IsEnum(AppointmentStatusEnum, {
    message: 'Status inválido. Deve ser um valor válido do AppointmentStatusEnum',
  })
  statusId!: AppointmentStatusEnum;
}
