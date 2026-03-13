import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Public, RequireRoles } from "src/shared/decorators";
import { HttpResponse } from "src/shared/types";
import { LoginService } from "../services/login.service";
import { LoginRequestDTO } from "../dto/request/login-request.dto";
import { LoginOutputDTO } from "../dto/io/login-io.dto";
import { UserTypesEnum } from "src/shared/enum";

@Controller()
@Public()
@RequireRoles(UserTypesEnum.BARBER, UserTypesEnum.CUSTOMER)
export class LoginController {
  constructor(private service: LoginService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async handle(
    @Body() body: LoginRequestDTO,
  ): Promise<HttpResponse<LoginOutputDTO>> {
    const data = await this.service.execute(body);

    return { data }
  }
}
