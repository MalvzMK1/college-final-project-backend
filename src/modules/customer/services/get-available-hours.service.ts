import { Injectable } from "@nestjs/common";
import { PrismaService, UserTypesEnum } from "src/shared";
import { GetAvailableHoursOutputDTO } from "../dto/io/get-available-hours-output.dto";

@Injectable()
export class GetAvailableHoursService {
  private hoursToGenerate = [8, 9, 10, 11, 14, 15, 16, 17, 18];
  private daysToGenerate = 7;

  constructor(private readonly prismaService: PrismaService) {}

  public async execute(): Promise<GetAvailableHoursOutputDTO> {
    const barbers = await this.prismaService.user.findMany({
      where: {
        userTypeId: UserTypesEnum.BARBER,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const sevenDaysFromTomorrow = new Date(tomorrow);
    sevenDaysFromTomorrow.setDate(tomorrow.getDate() + 7);
    sevenDaysFromTomorrow.setHours(23, 59, 59, 999);

    const appointments = await this.prismaService.appointment.findMany({
      where: {
        dateTime: {
          gte: tomorrow,
          lte: sevenDaysFromTomorrow,
        },
      },
      select: {
        dateTime: true,
        barberId: true,
      },
    });

    const result: GetAvailableHoursOutputDTO = { days: [] };

    for (let i = 0; i < this.daysToGenerate; i++) {
      const currentDay = new Date(tomorrow);
      currentDay.setDate(tomorrow.getDate() + i);

      const daySlots = {
        hours: [] as any[],
      };

      for (const hour of this.hoursToGenerate) {
        const slotDateTime = new Date(currentDay);
        slotDateTime.setHours(hour, 0, 0, 0);

        const barbersWithAppointment = new Set(
          appointments
            .filter(
              (app) =>
                app.dateTime.getTime() === slotDateTime.getTime()
            )
            .map((app) => app.barberId)
        );

        const availableBarbers = barbers.filter(
          (barber) => !barbersWithAppointment.has(barber.id)
        );

        daySlots.hours.push({
          datetime: slotDateTime,
          isAvailable: availableBarbers.length > 0,
          availableBarbers: availableBarbers.map((b) => b.name),
        });
      }

      result.days.push(daySlots);
    }

    return result;
  }
}
