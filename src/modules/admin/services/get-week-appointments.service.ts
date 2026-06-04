import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared";
import { GetWeekAppointmentsOutputDTO } from "../dto/io/get-week-appointments-output.dto";

@Injectable()
export class GetWeekAppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute(
    barberId: string,
    referenceDateInput?: string,
  ): Promise<GetWeekAppointmentsOutputDTO[]> {
    const { startOfWeek, endOfWeek } = this.getWeekRange(referenceDateInput);

    const appointments = await this.prismaService.appointment.findMany({
      where: {
        barberId,
        dateTime: {
          gte: startOfWeek,
          lte: endOfWeek,
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

    return appointments.map((appt) => ({
      id: appt.id,
      dateTime: appt.dateTime,
      customerName: appt.customer.name,
      status: appt.status,
    }));
  }

  private getWeekRange(dateInput?: string) {
    let date: Date;
    if (dateInput) {
      date = new Date(`${dateInput}T00:00:00.000Z`);
    } else {
      date = new Date();
    }
    
    const startOfWeek = new Date(date);
    const day = startOfWeek.getUTCDay();
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - day);
    startOfWeek.setUTCHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);
    
    return { startOfWeek, endOfWeek };
  }
}
