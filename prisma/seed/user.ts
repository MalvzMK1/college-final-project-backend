import { UserCreateManyInput } from "generated/prisma/models";
import { UserTypesEnum } from "src/shared/enum";
import { SeedFunction } from "./seed-function-type";
import { PrismaClient } from "generated/prisma/client";
import * as bcrypt from "bcrypt";

export const createUsers: SeedFunction = async (prisma: PrismaClient) => {
  const usersToBeCreated: UserCreateManyInput[] = [
    {
      name: 'Rodney',
      email: 'rodney.barber@mail.com',
      userTypeId: UserTypesEnum.BARBER,
      hashedPassword: bcrypt.hashSync('somestrongpassword', 10)
    },
    {
      name: 'Antônio',
      email: 'antonio.barber@mail.com',
      userTypeId: UserTypesEnum.BARBER,
      hashedPassword: bcrypt.hashSync('otherpassword', 10),
    },
    {
      name: 'Lucas',
      email: 'lucas.customer@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('customer1passoword', 10),
    },
    {
      name: 'Gustavo',
      email: 'gustavo.customer@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('customer2passoword', 10),
    },
  ];

  await prisma.user.createMany({
    data: usersToBeCreated,
    skipDuplicates: true,
  });
}
