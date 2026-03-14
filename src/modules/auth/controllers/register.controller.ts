import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Public } from "src/shared/decorators";
import { HttpResponse } from "src/shared/types";
import { RegisterRequestDTO } from "../dto/request/register-request.dto";
import { RegisterService } from "../services/register.service";

@Controller()
@Public()
export class RegisterController {
  constructor(private service: RegisterService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async handle(
    @Body() body: RegisterRequestDTO
  ): Promise<HttpResponse> {
    await this.service.execute(body);
    
    return {
      message: 'Usuário criado com sucesso',
    };
  }
}
