import { IsNotEmpty, IsUUID } from "class-validator";

export class TurnIntoBarberRouteParamsDTO {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}
