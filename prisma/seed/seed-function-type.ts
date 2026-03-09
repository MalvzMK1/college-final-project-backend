import { PrismaClient } from "@prisma/client/extension";

export type SeedFunction = (prisma: PrismaClient) => Promise<void>;
