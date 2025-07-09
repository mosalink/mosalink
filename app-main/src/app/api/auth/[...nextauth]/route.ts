import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { createTransport } from "nodemailer";
import sendMail from "@/services/mail/sendMail";
import sendTokenSessionMailContent from "@/services/mail/templates/sendTokenSession";
import { SupabaseAdapter } from "../../../../../lib/supabase-adapter";
import { supabaseAdmin } from "../../../../../lib/supabase";
import bcrypt from "bcryptjs";

// Fonction sécurisée de vérification de mot de passe
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

async function sendVerificationRequest(params: any) {
  const { identifier, url, provider } = params;
  const { host } = new URL(url);
  
  const { text, html } = sendTokenSessionMailContent({ url, host });
  const subject = `${process.env.NEXT_PUBLIC_APP_NAME} | Votre lien de connexion`;
  
  try {
    await sendMail({
      provider,
      identifier,
      host,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter(supabaseAdmin),
  providers: [
    EmailProvider({
      server: {
        host: process.env.MAILTRAP_HOST,
        port: parseInt(process.env.MAILTRAP_PORT || "587"),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest(params) {
        try {
          await sendVerificationRequest(params);
        } catch (error) {
          console.error("Erreur lors de l'envoi du mail de vérification:", error);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data: user, error } = await supabaseAdmin
            .from("User")
            .select("id, email, password, domainId")
            .eq("email", credentials.email)
            .single();

          if (error || !user || !user.password) {
            return null;
          }

          const isValidPassword = await verifyPassword(credentials.password, user.password);
          
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          console.error("Erreur lors de l'authentification:", error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, email }) {
      try {
        const { data: userExists } = await supabaseAdmin
          .from("User")
          .select("email, domainId")
          .eq("email", user.email ?? "")
          .single();
        if (userExists) {
          return true;
        } else {
          return true;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
        return true;
      }
    },
    async session({ session, token }) {
      if (session?.user && token?.email) {
        try {
          const { data: userData } = await supabaseAdmin
            .from("User")
            .select("id, domainId, role")
            .eq("email", token.email)
            .single();

          if (userData) {
            const { data: domain } = await supabaseAdmin
              .from("Domain")
              .select("id, name, url")
              .eq("id", userData.domainId)
              .single();

            session.user.domainId = userData.domainId;
            session.user.domainName = domain?.name;
            session.user.domainUrl = domain?.url;
            session.user.id = userData.id;
            session.user.role = userData.role;
            session.user.email = token.email;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('callbackUrl=')) {
        const callbackUrl = new URL(url).searchParams.get('callbackUrl');
        if (callbackUrl) {
          return decodeURIComponent(callbackUrl);
        }
      }
      
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
