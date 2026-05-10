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
        note: true,
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
      note: appt.note,
      dateTime: appt.dateTime,
      customerName: appt.customer.name,
      status: appt.status,
    }));
  }

  private getWeekRange(dateInput?: string) {
    const date = dateInput ? new Date(dateInput) : new Date();
    
    // Start of the week (Sunday)
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // End of the week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return { startOfWeek, endOfWeek };
  }
}
