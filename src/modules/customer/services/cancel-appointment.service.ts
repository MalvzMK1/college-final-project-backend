import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { AppointmentStatusEnum, PrismaService } from "src/shared";
import { AuthenticatedUser } from "src/shared/types";

@Injectable()
export class CancelAppointmentService {
  private allowedStatuses = new Set([
    AppointmentStatusEnum.PENDING,
    AppointmentStatusEnum.APPROVED,
  ]);

  constructor(private readonly prismaService: PrismaService) {}

  public async execute(appointmentId: number, user: AuthenticatedUser): Promise<void> {
    const appointment = await this.prismaService.appointment.findFirst({
      where:{
        id: appointmentId,
        customerId: user.id,
      },
      select: {
        dateTime: true,
        statusId: true,
      },
    });

    this.validateAppointment(appointment);

    await this.prismaService.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        statusId: AppointmentStatusEnum.CANCELED,
      }
    });
  }

  private validateAppointment(appointment: { dateTime: Date, statusId: AppointmentStatusEnum } | null): void {
    const today = new Date();

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (!this.allowedStatuses.has(appointment.statusId)) {
      throw new ForbiddenException('Só é possível cancelar um agendamento aprovado ou pendente');
    }

    if (appointment.dateTime < today) {
      throw new ForbiddenException('Não é possível cancelar um agendamento que já ocorreu');
    }

    const oneDayInMs = 24 * 60 * 60 * 1000;
    if (appointment.dateTime.getTime() - today.getTime() < oneDayInMs) {
      throw new ForbiddenException('Não é possível cancelar um agendamento com menos de um dia de antecedência');
    }
  }
}
