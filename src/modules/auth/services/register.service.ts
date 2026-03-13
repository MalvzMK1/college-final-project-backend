import { ConflictException, Injectable } from "@nestjs/common";
import { RegisterRequestDTO } from "../dto/request/register-request.dto";
import { PrismaService } from "src/shared";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { UserTypesEnum } from "src/shared/enum";

@Injectable()
export class RegisterService {
  private hashSaltRounds: number;

  constructor(
    private prismaService: PrismaService,
    configService: ConfigService,
  ) {
    this.hashSaltRounds = +configService.get<string>('HASH_SALT_ROUNDS', '10');
  }

  public async execute({
    name,
    email,
    password,
  }: RegisterRequestDTO): Promise<void> {
    const isEmailInUse = !!(
      await this.prismaService.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
        },
      })
    );

    if (isEmailInUse) throw new ConflictException('E-mail já está em uso');

    await this.prismaService.user.create({
      data: {
        email,
        name,
        hashedPassword: await bcrypt.hash(password, this.hashSaltRounds),
        userTypeId: UserTypesEnum.CUSTOMER,
      },
      select: {
        id: true,
      },
    });
  }
}
