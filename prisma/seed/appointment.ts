import { PrismaClient } from "generated/prisma/client";
import { SeedFunction } from "./seed-function-type";
import { AppointmentStatusEnum } from "src/shared/enum/appointment-status.enum";

export const createAppointments: SeedFunction = async (prisma: PrismaClient) => {
  // Find our mock barbers
  const rodney = await prisma.user.findFirst({
    where: { email: 'rodney.barber@mail.com' },
  });

  const antonio = await prisma.user.findFirst({
    where: { email: 'antonio.barber@mail.com' },
  });

  if (!rodney || !antonio) {
    console.warn('Barbers not found, skipping appointment seeding');
    return;
  }

  // Find some mock customers
  const lucas = await prisma.user.findFirst({ where: { email: 'lucas.customer@mail.com' } });
  const gustavo = await prisma.user.findFirst({ where: { email: 'gustavo.customer@mail.com' } });
  const joao = await prisma.user.findFirst({ where: { email: 'joao.silva@mail.com' } });
  const maria = await prisma.user.findFirst({ where: { email: 'maria.oliveira@mail.com' } });
  const pedro = await prisma.user.findFirst({ where: { email: 'pedro.santos@mail.com' } });

  const customers = [lucas, gustavo, joao, maria, pedro].filter(Boolean) as any[];

  if (customers.length === 0) {
    console.warn('No customers found, skipping appointment seeding');
    return;
  }

  // Define reference dates for the current week (May 10 to May 16, 2026)
  const appointmentsToCreate = [
    // Rodney's Appointments
    {
      customerId: customers[0].id,
      barberId: rodney.id,
      dateTime: new Date('2026-05-11T09:00:00.000Z'), // Monday
      statusId: AppointmentStatusEnum.PENDING,
      note: 'Corte social e barba',
    },
    {
      customerId: customers[1].id,
      barberId: rodney.id,
      dateTime: new Date('2026-05-12T10:00:00.000Z'), // Tuesday
      statusId: AppointmentStatusEnum.APPROVED,
      note: 'Degradê moderno',
    },
    {
      customerId: customers[2].id,
      barberId: rodney.id,
      dateTime: new Date('2026-05-13T14:30:00.000Z'), // Wednesday
      statusId: AppointmentStatusEnum.PENDING,
      note: 'Apenas aparar barba',
    },
    {
      customerId: customers[3].id,
      barberId: rodney.id,
      dateTime: new Date('2026-05-14T16:00:00.000Z'), // Thursday
      statusId: AppointmentStatusEnum.COMPLETED,
      note: 'Corte infantil',
    },
    {
      customerId: customers[4].id,
      barberId: rodney.id,
      dateTime: new Date('2026-05-15T11:00:00.000Z'), // Friday
      statusId: AppointmentStatusEnum.NO_SHOW,
      note: 'Sobrancelha e corte',
    },
    {
      customerId: customers[0].id,
      barberId: rodney.id,
      dateTime: new Date('2026-05-16T15:00:00.000Z'), // Saturday
      statusId: AppointmentStatusEnum.PENDING,
      note: 'Pezinho e lavagem',
    },

    // Antonio's Appointments (to test isolation)
    {
      customerId: customers[1].id,
      barberId: antonio.id,
      dateTime: new Date('2026-05-11T10:30:00.000Z'), // Monday
      statusId: AppointmentStatusEnum.PENDING,
      note: 'Corte clássico e toalha quente',
    },
    {
      customerId: customers[2].id,
      barberId: antonio.id,
      dateTime: new Date('2026-05-13T16:00:00.000Z'), // Wednesday
      statusId: AppointmentStatusEnum.APPROVED,
      note: 'Selagem capilar',
    },
  ];

  for (const appt of appointmentsToCreate) {
    // Check if appointment already exists at that time for the barber
    const existing = await prisma.appointment.findFirst({
      where: {
        barberId: appt.barberId,
        dateTime: appt.dateTime,
      },
    });

    if (!existing) {
      await prisma.appointment.create({
        data: appt,
      });
    }
  }

  console.log('Appointments successfully seeded for testing!');
};
