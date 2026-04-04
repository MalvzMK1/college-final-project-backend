import { Controller, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { HttpResponse } from "src/shared/types";
import { TurnIntoBarberRouteParamsDTO } from "../dto/route-params/turn-into-barber-route-params.dto";
import { RequireRoles } from "src/shared/decorators";
import { UserTypesEnum } from "src/shared/enum";
import { TurnIntoBarberService } from "../services/turn-into-barber.service";

@Controller()
@RequireRoles(UserTypesEnum.BARBER)
export class TurnIntoBarberController {
  constructor(private readonly turnIntoBarberService: TurnIntoBarberService) {}

  @Patch('/user/:userId/turn-into-barber')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @Param() { userId }: TurnIntoBarberRouteParamsDTO,
  ): Promise<HttpResponse> {
    await this.turnIntoBarberService.execute({ userId });

    return { message: 'Acesso de usuário atualizado com sucesso' };
  }
}
