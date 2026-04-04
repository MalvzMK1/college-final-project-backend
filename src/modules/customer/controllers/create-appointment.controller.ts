import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CurrentUser } from "src/shared/decorators";
import { HttpResponse } from "src/shared/types";
import { CreateAppointmentRequestDTO } from "../dto/request/create-appointment-request.dto";
import { CreateAppointmentService } from "../services/create-appointment.service";

@Controller()
export class CreateAppointmentController {
  constructor(private readonly createAppointmentService: CreateAppointmentService) {}

  @Post('appointment')
  @HttpCode(HttpStatus.CREATED)
  public async handle(
    @CurrentUser('id') customerId: string,
    @Body() body: CreateAppointmentRequestDTO,
  ): Promise<HttpResponse> {
    await this.createAppointmentService.execute(customerId, body);

    return { message: 'Agendamento solicitado com sucesso' };
  }
}
