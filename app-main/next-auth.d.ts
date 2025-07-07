import { Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      domainId: string;
      domainName: string;
      domainUrl: string;
      role: Role;
    } & DefaultSession["user"];
  }
}
