import { Test, TestingModule } from '@nestjs/testing';
import { GetWeekAppointmentsService } from './get-week-appointments.service';
import { PrismaService } from 'src/shared';

describe('GetWeekAppointmentsService', () => {
  let service: GetWeekAppointmentsService;
  let prismaService: PrismaService;

  const barberId = 'barber-uuid';
  
  // Reference date: Wednesday, May 13, 2026
  // Sunday of this week is May 10, 2026 (00:00:00.000 local time)
  // Saturday of this week is May 16, 2026 (23:59:59.999 local time)
  const referenceDate = '2026-05-13';
  
  // Calculate expected dates dynamically using UTC to match service logic
  const refDateObj = new Date(`${referenceDate}T00:00:00.000Z`);
  const expectedStart = new Date(refDateObj);
  const startDay = refDateObj.getUTCDay();
  expectedStart.setUTCDate(refDateObj.getUTCDate() - startDay);
  expectedStart.setUTCHours(0, 0, 0, 0);

  const expectedEnd = new Date(expectedStart);
  expectedEnd.setUTCDate(expectedStart.getUTCDate() + 6);
  expectedEnd.setUTCHours(23, 59, 59, 999);

  const mockDbAppointments = [
    {
      id: 1,
      dateTime: new Date('2026-05-11T10:00:00.000Z'),
      customer: { name: 'Customer A' },
      status: { id: 2, name: 'Aprovado' },
    },
    {
      id: 2,
      dateTime: new Date('2026-05-12T14:30:00.000Z'),
      customer: { name: 'Customer B' },
      status: { id: 1, name: 'Pendente' },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWeekAppointmentsService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              findMany: jest.fn().mockResolvedValue(mockDbAppointments),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GetWeekAppointmentsService>(GetWeekAppointmentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should find and format appointments within the calculated Sunday-Saturday week range', async () => {
    const result = await service.execute(barberId, referenceDate);

    expect(prismaService.appointment.findMany).toHaveBeenCalledWith({
      where: {
        barberId,
        dateTime: {
          gte: expectedStart,
          lte: expectedEnd,
        },
      },
      select: {
        id: true,
        dateTime: true,
        customer: {
          select: {
            name: true,
          },
        },
        status: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      dateTime: mockDbAppointments[0].dateTime,
      customerName: 'Customer A',
      status: { id: 2, name: 'Aprovado' },
    });
    expect(result[1]).toEqual({
      id: 2,
      dateTime: mockDbAppointments[1].dateTime,
      customerName: 'Customer B',
      status: { id: 1, name: 'Pendente' },
    });
  });

  it('should use the current date if no reference date is supplied', async () => {
    await service.execute(barberId);

    expect(prismaService.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          barberId,
          dateTime: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        }),
      }),
    );
  });
});
