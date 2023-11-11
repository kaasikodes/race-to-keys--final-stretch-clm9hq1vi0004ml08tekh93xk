import ENV from "@/config/enviroment";
import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/config/database";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      hasAptosAccountAndPrivateKey: boolean;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
  interface JWT extends DefaultJWT {
    hasAptosAccountAndPrivateKey: boolean;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt", //specify jwt as by default with adapter its set to database
  },
  callbacks: {
    jwt: async ({ token }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: token?.sub,
        },
        select: {
          privateKey: true,
        },
      });
      token.hasAptosAccountAndPrivateKey = user?.privateKey ? true : false;

      return token;
    },

    session: async ({ session, token }) => {
      if (token) {
        const dbUser = await prisma.user.findFirst({
          where: {
            id: token?.sub,
          },
          select: {
            privateKey: true,
            id: true,
          },
        });
        const hasAptosAccountAndPrivateKey = dbUser?.privateKey ? true : false;
        // Set the user ID in the session
        session = {
          ...session,
          user: {
            ...session.user,
            id: dbUser?.id as unknown as string,
            hasAptosAccountAndPrivateKey,
          },
        };
      }

      return session;
    },
  },
  secret: ENV.NEXTAUTH_SECRET,
  providers: [
    TwitterProvider({
      clientId: ENV.TWITTER_CLIENT_ID,
      clientSecret: ENV.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
