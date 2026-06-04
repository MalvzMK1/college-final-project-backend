import { IsDateString, IsOptional } from "class-validator";

export class GetWeekAppointmentsQueryParamsDTO {
  @IsDateString()
  @IsOptional()
  date?: string;
}
