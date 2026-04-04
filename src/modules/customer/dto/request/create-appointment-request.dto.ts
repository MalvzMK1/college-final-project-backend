import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";

export class CreateAppointmentRequestDTO {
  @IsUUID()
  @IsNotEmpty()
  barberId!: string;

  @IsDateString()
  @IsNotEmpty()
  dateTime!: string;
}
