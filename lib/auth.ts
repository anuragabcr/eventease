import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Session, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (
          user &&
          bcrypt.compareSync(credentials?.password || "", user.password)
        ) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email || "" },
      });
      if (session.user && token?.sub) {
        (session.user as { id: string }).id = token.sub;
        (session.user as { role: string }).role = user?.role || "";
      }
      return session;
    },
  },
};
