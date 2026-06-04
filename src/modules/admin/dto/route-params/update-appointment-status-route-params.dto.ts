import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateAppointmentStatusRouteParamsDTO {
  @IsInt()
  @IsNotEmpty()
  appointmentId!: number;
}
