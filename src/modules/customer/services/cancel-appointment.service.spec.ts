import { Test, TestingModule } from '@nestjs/testing';
import { CancelAppointmentService } from './cancel-appointment.service';
import { PrismaService, UserTypesEnum, AppointmentStatusEnum } from 'src/shared';
import { AuthenticatedUser } from 'src/shared/types';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CancelAppointmentService', () => {
  let service: CancelAppointmentService;
  let prismaService: PrismaService;

  const mockUser: AuthenticatedUser = {
    id: 'customer-uuid',
    roleId: UserTypesEnum.CUSTOMER,
  };

  const appointmentId = 123;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelAppointmentService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CancelAppointmentService>(CancelAppointmentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should cancel an appointment successfully', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // 2 days in the future

    const mockAppointment = {
      dateTime: tomorrow,
      statusId: AppointmentStatusEnum.APPROVED,
    };

    prismaService.appointment.findFirst = jest.fn().mockResolvedValue(mockAppointment);
    prismaService.appointment.update = jest.fn().mockResolvedValue({ id: appointmentId });

    await service.execute(appointmentId, mockUser);

    expect(prismaService.appointment.findFirst).toHaveBeenCalledWith({
      where: {
        id: appointmentId,
        customerId: mockUser.id,
      },
      select: {
        dateTime: true,
        statusId: true,
      },
    });

    expect(prismaService.appointment.update).toHaveBeenCalledWith({
      where: {
        id: appointmentId,
      },
      data: {
        statusId: AppointmentStatusEnum.CANCELED,
      },
    });
  });

  it('should throw NotFoundException if appointment does not exist', async () => {
    prismaService.appointment.findFirst = jest.fn().mockResolvedValue(null);

    await expect(service.execute(appointmentId, mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException if appointment status is already canceled', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);

    const mockAppointment = {
      dateTime: tomorrow,
      statusId: AppointmentStatusEnum.CANCELED,
    };

    prismaService.appointment.findFirst = jest.fn().mockResolvedValue(mockAppointment);

    await expect(service.execute(appointmentId, mockUser)).rejects.toThrow(
      new ForbiddenException('Só é possível cancelar um agendamento aprovado ou pendente'),
    );
  });

  it('should throw ForbiddenException if appointment already occurred', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const mockAppointment = {
      dateTime: yesterday,
      statusId: AppointmentStatusEnum.PENDING,
    };

    prismaService.appointment.findFirst = jest.fn().mockResolvedValue(mockAppointment);

    await expect(service.execute(appointmentId, mockUser)).rejects.toThrow(
      new ForbiddenException('Não é possível cancelar um agendamento que já ocorreu'),
    );
  });

  it('should throw ForbiddenException if appointment is less than 24 hours away', async () => {
    const in12Hours = new Date();
    in12Hours.setHours(in12Hours.getHours() + 12);

    const mockAppointment = {
      dateTime: in12Hours,
      statusId: AppointmentStatusEnum.PENDING,
    };

    prismaService.appointment.findFirst = jest.fn().mockResolvedValue(mockAppointment);

    await expect(service.execute(appointmentId, mockUser)).rejects.toThrow(
      new ForbiddenException('Não é possível cancelar um agendamento com menos de um dia de antecedência'),
    );
  });
});
