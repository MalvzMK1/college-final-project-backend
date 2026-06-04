import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { TurnIntoBarberInputDTO } from "../dto/io/turn-into-barber-input.dto";
import { PrismaService } from "src/shared";
import { UserTypesEnum } from "src/shared/enum";

@Injectable()
export class TurnIntoBarberService {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute({
    userId,
  }: TurnIntoBarberInputDTO): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        userTypeId: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.userTypeId === UserTypesEnum.BARBER) {
      throw new ConflictException('O usuário já é um barbeiro');
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        userTypeId: UserTypesEnum.BARBER,
      }
    });
  }
}
