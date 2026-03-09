import { PrismaClient } from "../../generated/prisma/client";
import { createAppointmentStatus } from "./appointment-status";
import { createUsers } from "./user";
import { createUserTypes } from "./user-type";
import { PrismaPg } from "@prisma/adapter-pg";

type Environment = 'development' | 'production';

function getEnvironmentFromProcess(): Environment | null {
  const validEnvironments = new Set(['development', 'production']);
  let environment: Environment | null = null;

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === '--environment') {
      const providedEnvironment = process.argv[i+1];
      if (!validEnvironments.has(providedEnvironment)) {
        throw new Error(`Invalid environment ${providedEnvironment}\nMust be some of: ${Array.from(validEnvironments).join(', ')}`);
      }
      environment = providedEnvironment as Environment;
    }
  }

  return environment;
}

async function main() {
  const prodSeeds = [
    createAppointmentStatus,
    createUserTypes,
  ];

  const developmentSeeds = [
    ...prodSeeds,
    createUsers,
  ]

  const environment = getEnvironmentFromProcess();

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  let seeds = prodSeeds;

  if (environment === 'development') {
    seeds = developmentSeeds;
  }

  for (const seedFunction of seeds) {
    await seedFunction(prisma);
  }
}

main()
  .then(() => console.log('Seed completed'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

process.exit(0);
