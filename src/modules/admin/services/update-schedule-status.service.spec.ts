import { Test, TestingModule } from '@nestjs/testing';
import { UpdateScheduleStatusService } from './update-schedule-status.service';
import { PrismaService } from 'src/shared';
import { AppointmentStatusEnum } from 'src/shared/enum/appointment-status.enum';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UpdateScheduleStatusService', () => {
  let service: UpdateScheduleStatusService;
  let prismaService: PrismaService;

  const barberId = 'barber-uuid';
  const otherBarberId = 'other-barber-uuid';
  const appointmentId = 123;
  const mockDateTime = new Date('2026-05-10T15:00:00.000Z');

  const mockAppointment = {
    id: appointmentId,
    barberId,
    statusId: AppointmentStatusEnum.PENDING,
    dateTime: mockDateTime,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateScheduleStatusService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              findUnique: jest.fn().mockResolvedValue(mockAppointment),
              findFirst: jest.fn().mockResolvedValue(null),
              update: jest.fn().mockResolvedValue({ ...mockAppointment, statusId: AppointmentStatusEnum.APPROVED }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UpdateScheduleStatusService>(UpdateScheduleStatusService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should update appointment status to APPROVED successfully', async () => {
    await service.execute({
      barberId,
      appointmentId,
      statusId: AppointmentStatusEnum.APPROVED,
    });

    expect(prismaService.appointment.findUnique).toHaveBeenCalledWith({
      where: { id: appointmentId },
    });

    expect(prismaService.appointment.findFirst).toHaveBeenCalledWith({
      where: {
        barberId,
        dateTime: mockDateTime,
        statusId: AppointmentStatusEnum.APPROVED,
        id: { not: appointmentId },
      },
    });

    expect(prismaService.appointment.update).toHaveBeenCalledWith({
      where: { id: appointmentId },
      data: { statusId: AppointmentStatusEnum.APPROVED },
    });
  });

  it('should throw NotFoundException if appointment does not exist', async () => {
    prismaService.appointment.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      service.execute({
        barberId,
        appointmentId,
        statusId: AppointmentStatusEnum.APPROVED,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not the owner barber', async () => {
    await expect(
      service.execute({
        barberId: otherBarberId,
        appointmentId,
        statusId: AppointmentStatusEnum.APPROVED,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw ConflictException if the appointment is already canceled', async () => {
    prismaService.appointment.findUnique = jest.fn().mockResolvedValue({
      ...mockAppointment,
      statusId: AppointmentStatusEnum.CANCELED,
    });

    await expect(
      service.execute({
        barberId,
        appointmentId,
        statusId: AppointmentStatusEnum.APPROVED,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if the appointment already has the requested status', async () => {
    prismaService.appointment.findUnique = jest.fn().mockResolvedValue({
      ...mockAppointment,
      statusId: AppointmentStatusEnum.APPROVED,
    });

    await expect(
      service.execute({
        barberId,
        appointmentId,
        statusId: AppointmentStatusEnum.APPROVED,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException if trying to update to an unallowed status', async () => {
    await expect(
      service.execute({
        barberId,
        appointmentId,
        statusId: AppointmentStatusEnum.PENDING,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if trying to approve but slot is already busy with an approved appointment', async () => {
    prismaService.appointment.findFirst = jest.fn().mockResolvedValue({ id: 999 });

    await expect(
      service.execute({
        barberId,
        appointmentId,
        statusId: AppointmentStatusEnum.APPROVED,
      }),
    ).rejects.toThrow(ConflictException);
  });
});
