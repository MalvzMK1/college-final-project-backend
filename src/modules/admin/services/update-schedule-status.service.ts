import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared";
import { AppointmentStatusEnum } from "src/shared/enum/appointment-status.enum";
import { UpdateAppointmentStatusInputDTO } from "../dto/io/update-appointment-status-input.dto";

interface ValidationAppointment {
  id: number;
  barberId: string;
  statusId: number | null;
  dateTime: Date;
}

@Injectable()
export class UpdateScheduleStatusService {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute({
    barberId,
    appointmentId,
    statusId,
  }: UpdateAppointmentStatusInputDTO): Promise<void> {
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id: appointmentId },
    });

    this.validateAppointment(appointment, barberId, statusId);

    if (statusId === AppointmentStatusEnum.APPROVED) {
      const activeAppointment = await this.prismaService.appointment.findFirst({
        where: {
          barberId,
          dateTime: appointment.dateTime,
          statusId: AppointmentStatusEnum.APPROVED,
          id: { not: appointmentId },
        },
      });

      if (activeAppointment) {
        throw new ConflictException('O barbeiro já possui um agendamento aprovado para este horário');
      }
    }

    await this.prismaService.appointment.update({
      where: { id: appointmentId },
      data: { statusId },
    });
  }

  private validateAppointment(
    appointment: ValidationAppointment | null,
    barberId: string,
    statusId: AppointmentStatusEnum,
  ): asserts appointment is ValidationAppointment {
    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (appointment.barberId !== barberId) {
      throw new ForbiddenException('Sem permissão para atualizar este agendamento');
    }

    if (appointment.statusId === AppointmentStatusEnum.CANCELED) {
      throw new ConflictException('Não é possível atualizar um agendamento cancelado');
    }

    const allowedStatuses = [
      AppointmentStatusEnum.APPROVED,
      AppointmentStatusEnum.REJECTED,
      AppointmentStatusEnum.COMPLETED,
      AppointmentStatusEnum.NO_SHOW,
    ];

    if (!allowedStatuses.includes(statusId)) {
      throw new BadRequestException('Status não permitido para atualização');
    }

    if (appointment.statusId === statusId) {
      throw new ConflictException('O agendamento já possui este status');
    }
  }
}
