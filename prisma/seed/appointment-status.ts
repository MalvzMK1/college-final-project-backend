import { PrismaClient } from "generated/prisma/client";
import { SeedFunction } from "./seed-function-type";
import { AppointmentStatusCreateManyInput } from "generated/prisma/models";
import { AppointmentStatusEnum } from "src/shared/enum/appointment-status.enum";

export const createAppointmentStatus: SeedFunction = async (prisma: PrismaClient) => {
  const appointmentStatusToBeCreated: AppointmentStatusCreateManyInput[] = [
    {
      id: AppointmentStatusEnum.PENDING,
      name: 'Pendente',
    },
    {
      id: AppointmentStatusEnum.APPROVED,
      name: 'Aprovado',
    },
    {
      id: AppointmentStatusEnum.REJECTED,
      name: 'Rejeitado',
    },
    {
      id: AppointmentStatusEnum.COMPLETED,
      name: 'Concluído',
    },
    {
      id: AppointmentStatusEnum.NO_SHOW,
      name: 'Não compareceu',
    },
    {
      id: AppointmentStatusEnum.CANCELED,
      name: 'Cancelado',
    },
  ];

  await prisma.appointmentStatus.createMany({
    data: appointmentStatusToBeCreated,
    skipDuplicates: true,
  })
}
