import { Test, TestingModule } from '@nestjs/testing';
import { GetAvailableHoursService } from './get-available-hours.service';
import { PrismaService } from 'src/shared';

describe('GetAvailableHoursService', () => {
  let service: GetAvailableHoursService;
  let prismaService: PrismaService;

  const mockBarbers = [
    { id: 'barber-1', name: 'Barber One' },
    { id: 'barber-2', name: 'Barber Two' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAvailableHoursService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn().mockResolvedValue(mockBarbers),
            },
            appointment: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GetAvailableHoursService>(GetAvailableHoursService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 7 days with correct hours', async () => {
    const result = await service.execute();

    expect(result.days.length).toBe(7);
    result.days.forEach((day) => {
      expect(day.hours.length).toBe(9); // 8, 9, 10, 11, 14, 15, 16, 17, 18
      const hours = day.hours.map((h) => h.datetime.getHours());
      expect(hours).toEqual([8, 9, 10, 11, 14, 15, 16, 17, 18]);
    });
  });

  it('should correctly identify available barbers', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    prismaService.appointment.findMany = jest.fn().mockResolvedValue([
      {
        dateTime: tomorrow,
        barberId: 'barber-1',
      },
    ]);

    const result = await service.execute();

    const tomorrowSlot = result.days[0].hours.find(
      (h) => h.datetime.getTime() === tomorrow.getTime()
    );

    expect(tomorrowSlot!.isAvailable).toBe(true);
    expect(tomorrowSlot!.availableBarbers[0].name).toEqual('Barber Two');
  });

  it('should mark as unavailable when all barbers are busy', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    prismaService.appointment.findMany = jest.fn().mockResolvedValue([
      {
        dateTime: tomorrow,
        barberId: 'barber-1',
      },
      {
        dateTime: tomorrow,
        barberId: 'barber-2',
      },
    ]);

    const result = await service.execute();

    const tomorrowSlot = result.days[0].hours.find(
      (h) => h.datetime.getTime() === tomorrow.getTime()
    );

    expect(tomorrowSlot!.isAvailable).toBe(false);
    expect(tomorrowSlot!.availableBarbers).toEqual([]);
  });
});
