import { PrismaClient } from "@prisma/client";
import ENV from "./enviroment";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log:
    //   ENV.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (ENV.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
