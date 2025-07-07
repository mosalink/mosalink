import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import sendMail from "@/services/mail/sendMail";
import sendTokenSessionMailContent from "@/services/mail/templates/sendTokenSession";
import { SupabaseAdapter } from "../../../../../lib/supabase-adapter";
import { supabaseAdmin } from "../../../../../lib/supabase";

async function sendVerificationRequest(params: any) {
  const { identifier, url, provider } = params;
  const { host } = new URL(url);
  
  const { text, html } = sendTokenSessionMailContent({ url, host });
  const subject = `${process.env.NEXT_PUBLIC_APP_NAME} | Votre lien de connection`;
  
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
    async session({ session, user }) {
      if (session?.user && user?.email) {
        try {
          const { data: userData } = await supabaseAdmin
            .from("User")
            .select("id, domainId, role")
            .eq("email", user.email)
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
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
