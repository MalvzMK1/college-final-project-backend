import { Test, TestingModule } from '@nestjs/testing';
import { CreateAppointmentService } from './create-appointment.service';
import { PrismaService, UserTypesEnum } from 'src/shared';
import { AppointmentStatusEnum } from 'src/shared/enum/appointment-status.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CreateAppointmentService', () => {
  let service: CreateAppointmentService;
  let prismaService: PrismaService;

  const mockBarber = { id: 'barber-uuid', userTypeId: UserTypesEnum.BARBER };
  const customerId = 'customer-uuid';
  const appointmentData = {
    barberId: 'barber-uuid',
    dateTime: '2026-04-10T10:00:00.000Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAppointmentService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn().mockResolvedValue(mockBarber),
            },
            appointment: {
              findFirst: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({ id: 1 }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CreateAppointmentService>(CreateAppointmentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create an appointment successfully', async () => {
    await service.execute(customerId, appointmentData);

    expect(prismaService.appointment.create).toHaveBeenCalledWith({
      data: {
        customerId,
        barberId: appointmentData.barberId,
        dateTime: new Date(appointmentData.dateTime),
        statusId: AppointmentStatusEnum.PENDING,
      },
    });
  });

  it('should throw NotFoundException if barber does not exist', async () => {
    prismaService.user.findFirst = jest.fn().mockResolvedValue(null);

    await expect(service.execute(customerId, appointmentData)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ConflictException if barber is busy at that time', async () => {
    prismaService.appointment.findFirst = jest.fn().mockResolvedValue({ id: 99 });

    await expect(service.execute(customerId, appointmentData)).rejects.toThrow(
      ConflictException,
    );
  });
});
