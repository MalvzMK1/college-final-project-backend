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
    {
      name: 'João Silva',
      email: 'joao.silva@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Pedro Santos',
      email: 'pedro.santos@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Ana Costa',
      email: 'ana.costa@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Carlos Souza',
      email: 'carlos.souza@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Beatriz Lima',
      email: 'beatriz.lima@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Marcos Rocha',
      email: 'marcos.rocha@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Julia Mendes',
      email: 'julia.mendes@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Ricardo Alves',
      email: 'ricardo.alves@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Fernanda Dias',
      email: 'fernanda.dias@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Roberto Farias',
      email: 'roberto.farias@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Camila Gomes',
      email: 'camila.gomes@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'André Ribeiro',
      email: 'andre.ribeiro@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Patrícia Nunes',
      email: 'patricia.nunes@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Felipe Martins',
      email: 'felipe.martins@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Larissa Carvalho',
      email: 'larissa.carvalho@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Gabriel Pereira',
      email: 'gabriel.pereira@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Bruna Ferreira',
      email: 'bruna.ferreira@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Tiago Barbosa',
      email: 'tiago.barbosa@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
    {
      name: 'Letícia Castro',
      email: 'leticia.castro@mail.com',
      userTypeId: UserTypesEnum.CUSTOMER,
      hashedPassword: bcrypt.hashSync('password123', 10),
    },
  ];

  await prisma.user.createMany({
    data: usersToBeCreated,
    skipDuplicates: true,
  });
}
