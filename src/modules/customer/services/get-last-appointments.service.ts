import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared";
import { AuthenticatedUser } from "src/shared/types";
import { GetLastAppointmentsOutputDTO } from "../dto/io/get-last-appointments-output.dto";

@Injectable()
export class GetLastAppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute(user: AuthenticatedUser): Promise<GetLastAppointmentsOutputDTO> {
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
