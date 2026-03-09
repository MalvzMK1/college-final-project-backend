import { PrismaClient } from "generated/prisma/client";
import { SeedFunction } from "./seed-function-type";
import { UserTypeCreateManyInput } from "generated/prisma/models";

export const createUserTypes: SeedFunction = async (prisma: PrismaClient) => {
  const userTypesToBeCreated: UserTypeCreateManyInput[] = [
    {
      name: 'Barbeiro',
    },
    {
      name: 'Cliente',
    },
  ];

  await prisma.userType.createMany({
    data: userTypesToBeCreated,
    skipDuplicates: true,
  });
}
