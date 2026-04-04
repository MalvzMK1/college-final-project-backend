import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService, UserTypesEnum } from "src/shared";
import { CreateAppointmentRequestDTO } from "../dto/request/create-appointment-request.dto";
import { AppointmentStatusEnum } from "src/shared/enum/appointment-status.enum";

@Injectable()
export class CreateAppointmentService {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute(
    customerId: string,
    { barberId, dateTime }: CreateAppointmentRequestDTO,
  ): Promise<void> {
    const barber = await this.prismaService.user.findFirst({
      where: {
        id: barberId,
        userTypeId: UserTypesEnum.BARBER,
      },
    });

    if (!barber) {
      throw new NotFoundException('Barbeiro não encontrado');
    }

    const requestedDate = new Date(dateTime);

    const existingAppointment = await this.prismaService.appointment.findFirst({
      where: {
        barberId,
        dateTime: requestedDate,
        statusId: {
          in: [AppointmentStatusEnum.PENDING, AppointmentStatusEnum.APPROVED],
        },
      },
    });

    if (existingAppointment) {
      throw new ConflictException('Já existe um agendamento para este barbeiro neste horário');
    }

    await this.prismaService.appointment.create({
      data: {
        customerId,
        barberId,
        dateTime: requestedDate,
        statusId: AppointmentStatusEnum.PENDING,
      },
    });
  }
}
