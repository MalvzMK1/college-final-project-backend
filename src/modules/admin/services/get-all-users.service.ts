import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared";
import { GetAllUsersQueryParamsDTO } from "../dto/query-params/get-all-users-query-params.dto";
import { GetAllUsersOutputDTO } from "../dto/io/get-all-users-output.dto";
import { Prisma } from "generated/prisma/client";

@Injectable()
export class GetAllUsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute(
    currentUserId: string,
    { name, userTypeId, skip, take }: GetAllUsersQueryParamsDTO,
  ): Promise<GetAllUsersOutputDTO> {
    const where: Prisma.UserWhereInput = {
      id: { not: currentUserId },
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(userTypeId && { userTypeId }),
    };

    const [users, totalCount] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        skip: +skip,
        take: +take,
        select: {
          id: true,
          name: true,
          userTypeId: true,
          _count: {
            select: {
              scheduledAppointments: true,
              ownedAppointments: true,
            },
          },
        },
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      users: users.map(({ _count, ...data }) => ({
        ...data,
        scheduledAppointmentsAmmount: _count.scheduledAppointments,
        ownedAppointmentsAmmount: _count.ownedAppointments,
      })),
      totalCount,
    };
  }
}
