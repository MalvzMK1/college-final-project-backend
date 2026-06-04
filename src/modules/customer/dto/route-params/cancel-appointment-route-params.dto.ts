import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class CancelAppointmentRouteParamsDTO {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  public appointmentId!: number;
}
