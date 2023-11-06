import ENV from "@/config/enviroment";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const handler = NextAuth({
  secret: ENV.NEXTAUTH_SECRET,
  providers: [
    TwitterProvider({
      clientId: ENV.TWITTER_CLIENT_ID,
      clientSecret: ENV.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
  ],
  adapter: PrismaAdapter(prisma),
});

export { handler as GET, handler as POST };
