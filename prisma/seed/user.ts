import { PrismaClient } from "@prisma/client"
import { UserCreateManyInput } from "generated/prisma/models";
import { UserTypesEnum } from "src/shared/enum";
import { hash } from "crypto";
import { SeedFunction } from "./seed-function-type";

export const createUsers: SeedFunction = async (prisma: PrismaClient) => {
  const usersToBeCreated: UserCreateManyInput[] = [
    {
      name: 'Rodney',
      email: 'rodney.barber@mail.com',
      userTypeId: UserTypesEnum.BARBER,
      hashedPassword: hash('md5', 'somestrongpassword'),
    },
    {
      name: 'Antônio',
      email: 'antonio.barber@mail.com',
      userTypeId: UserTypesEnum.BARBER,
      hashedPassword: hash('md5', 'otherpassword'),
    },
    {
      name: 'Lucas',
      email: 'lucas.customer@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: hash('md5', 'customer1passoword'),
    },
    {
      name: 'Gustavo',
      email: 'gustavo.customer@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: hash('md5', 'customer2passoword'),
    },
  ];

  await prisma.user.createMany({
    data: usersToBeCreated,
    skipDuplicates: true,
  });
}
