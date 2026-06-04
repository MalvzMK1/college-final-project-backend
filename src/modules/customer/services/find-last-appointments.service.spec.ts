import { Test, TestingModule } from '@nestjs/testing';
import { FindLastAppointmentsService } from './find-last-appointments.service';
import { PrismaService, UserTypesEnum } from 'src/shared';
import { AuthenticatedUser } from 'src/shared/types';

describe('FindLastAppointmentsService', () => {
  let service: FindLastAppointmentsService;
  let prismaService: PrismaService;

  const mockUser: AuthenticatedUser = {
    id: 'customer-uuid',
    roleId: UserTypesEnum.CUSTOMER,
  };

  const mockAppointments = [
    {
      id: 1,
      createdAt: new Date('2026-05-01T10:00:00.000Z'),
      dateTime: new Date('2026-05-02T14:00:00.000Z'),
      barber: { name: 'John Barber' },
      status: { id: 1, name: 'Pendente' },
    },
    {
      id: 2,
      createdAt: new Date('2026-05-05T10:00:00.000Z'),
      dateTime: new Date('2026-05-06T15:00:00.000Z'),
      barber: { name: 'Mary Barber' },
      status: { id: 2, name: 'Confirmado' },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindLastAppointmentsService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              findMany: jest.fn().mockResolvedValue(mockAppointments),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FindLastAppointmentsService>(FindLastAppointmentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find last appointments of the customer and map them correctly', async () => {
    const result = await service.execute(mockUser);

    expect(prismaService.appointment.findMany).toHaveBeenCalledWith({
      where: {
        customerId: mockUser.id,
        createdAt: {
          gte: expect.any(Date),
        },
      },
      select: {
        id: true,
        barber: {
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
        createdAt: true,
        dateTime: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
    });

    expect(result).toEqual([
      {
        id: 1,
        createdAt: mockAppointments[0].createdAt,
        dateTime: mockAppointments[0].dateTime,
        barberName: 'John Barber',
        status: { id: 1, name: 'Pendente' },
      },
      {
        id: 2,
        createdAt: mockAppointments[1].createdAt,
        dateTime: mockAppointments[1].dateTime,
        barberName: 'Mary Barber',
        status: { id: 2, name: 'Confirmado' },
      },
    ]);
  });
});
