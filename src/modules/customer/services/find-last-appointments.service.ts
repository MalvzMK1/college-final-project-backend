import { Injectable } from "@nestjs/common";
import { FindLastAppointmentsOutputDTO } from "../dto/io/find-last-appointments-output.dto";
import { PrismaService } from "src/shared";
import { AuthenticatedUser } from "src/shared/types";

@Injectable()
export class FindLastAppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute(user: AuthenticatedUser): Promise<FindLastAppointmentsOutputDTO> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const appointments = await this.prismaService.appointment.findMany({
      where: {
        customerId: user.id,
        createdAt: {
          gte: oneYearAgo,
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

    return appointments.map(({
      barber,
      ...data
    }) => ({
      ...data,
      barberName: barber.name,
    }))
  }
}
