import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { CurrentUser, RequireRoles } from "src/shared/decorators";
import { UserTypesEnum } from "src/shared/enum";
import { HttpResponse } from "src/shared/types";
import { GetAllUsersQueryParamsDTO } from "../dto/query-params/get-all-users-query-params.dto";
import { GetAllUsersOutputDTO } from "../dto/io/get-all-users-output.dto";
import { GetAllUsersService } from "../services/get-all-users.service";

@Controller()
@RequireRoles(UserTypesEnum.BARBER)
export class GetAllUsersController {
  constructor(private readonly getAllUsersService: GetAllUsersService) {}

  @Get('user')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @CurrentUser('id') currentUserId: string,
    @Query() queryParams: GetAllUsersQueryParamsDTO,
  ): Promise<HttpResponse<GetAllUsersOutputDTO>> {
    const data = await this.getAllUsersService.execute(currentUserId, queryParams);

    return { data };
  }
}
