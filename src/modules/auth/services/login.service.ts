import { Injectable, NotFoundException } from "@nestjs/common";
import { LoginInputDTO, LoginOutputDTO } from "../dto/io/login-io.dto";
import { PrismaService } from "src/shared";
import * as bcrypt from "bcrypt";
import { UserTypesEnum } from "src/shared/enum";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { AuthenticatedUser } from "src/shared/types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LoginService {
  private jwtSecret: string;
  private jwtAlgorithm: JwtSignOptions['algorithm'];

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtSecret = configService.get<string>('JWT_SECRET', 'super_secret_secret');
    this.jwtAlgorithm = configService.get<JwtSignOptions['algorithm']>('JWT_ALGORITHM', 'HS256');
  }

  public async execute({ email, password }: LoginInputDTO): Promise<LoginOutputDTO> {
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        userTypeId: true,
        hashedPassword: true,
      },
    });

    if (!foundUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.hashedPassword);

    if (!isPasswordCorrect) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.generateUserToken(foundUser);
  }

  private async generateUserToken({
    id,
    userTypeId,
  }: { id: string, userTypeId: UserTypesEnum }): Promise<LoginOutputDTO> {
    const payload: AuthenticatedUser = {
      id,
      roleId: userTypeId,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      algorithm: this.jwtAlgorithm,
    });

    return { token, userTypeId };
  }
}
