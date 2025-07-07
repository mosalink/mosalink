import { Adapter } from "next-auth/adapters"
import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "./database.types"

export function SupabaseAdapter(supabase: SupabaseClient<Database>): Adapter {
  return {
    async createUser(user) {
      console.log("🚀 CreateUser appelé avec:", user);
      
      try {
        const { data: defaultDomain } = await supabase
          .from("Domain")
          .select("id")
          .eq("name", "test")
          .single();

        let domainId = defaultDomain?.id;
        if (!domainId) {
          const { data: firstDomain } = await supabase
            .from("Domain")
            .select("id")
            .limit(1)
            .single();
          domainId = firstDomain?.id || 'clkgzh6ep0000x9im9ze8s653'; // super-admin
        }

        const { data, error } = await supabase
          .from("User")
          .insert({
            id: crypto.randomUUID(),
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: user.emailVerified?.toISOString(),
            domainId: domainId,
            role: 'USER'
          })
          .select()
          .single()

        if (error) {
          console.error("❌ Erreur lors de la création de l'utilisateur:", error);
          throw error;
        }
        
        console.log("✅ Utilisateur créé avec succès:", data);
        return {
          id: data.id,
          email: data.email!,
          name: data.name,
          image: data.image,
          emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
        }
      } catch (error) {
        console.error("❌ Erreur dans createUser:", error);
        throw error;
      }
    },

    async getUser(id) {
      console.log("🔍 GetUser appelé avec id:", id);
      
      try {
        const { data, error } = await supabase
          .from("User")
          .select()
          .eq("id", id)
          .maybeSingle()

        if (error) {
          console.error("❌ Erreur lors de la récupération de l'utilisateur:", error);
          throw error;
        }
        
        if (!data) return null

        console.log("✅ Utilisateur trouvé:", data);
        return {
          id: data.id,
          email: data.email!,
          name: data.name,
          image: data.image,
          emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
        }
      } catch (error) {
        console.error("❌ Erreur dans getUser:", error);
        throw error;
      }
    },

    async getUserByEmail(email) {
      try {
        console.log("Tentative de récupération de l'utilisateur par email:", email);
        const { data, error } = await supabase
          .from("User")
          .select()
          .eq("email", email)
          .maybeSingle()

        if (error) {
          console.error("Erreur Supabase dans getUserByEmail:", error);
          throw error;
        }
        
        console.log("Utilisateur trouvé:", data ? "Oui" : "Non");
        if (!data) return null

        return {
          id: data.id,
          email: data.email!,
          name: data.name,
          image: data.image,
          emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
        }
      } catch (error) {
        console.error("Erreur complète dans getUserByEmail:", error);
        throw error;
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await supabase
        .from("Account")
        .select(`
          User (
            id,
            email,
            name,
            image,
            emailVerified
          )
        `)
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId)
        .maybeSingle()

      if (error) throw error
      if (!data?.User) return null

      const user = Array.isArray(data.User) ? data.User[0] : data.User

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      }
    },

    async updateUser(user) {
      const { data, error } = await supabase
        .from("User")
        .update({
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .eq("id", user.id!)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        email: data.email!,
        name: data.name,
        image: data.image,
        emailVerified: data.emailVerified ? new Date(data.emailVerified) : null,
      }
    },

    async deleteUser(userId) {
      const { error } = await supabase
        .from("User")
        .delete()
        .eq("id", userId)

      if (error) throw error
    },

    async linkAccount(account) {
      const { data, error } = await supabase
        .from("Account")
        .insert({
          id: crypto.randomUUID(),
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        refresh_token: data.refresh_token,
        access_token: data.access_token,
        expires_at: data.expires_at,
        token_type: data.token_type,
        scope: data.scope,
        id_token: data.id_token,
        session_state: data.session_state,
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const { error } = await supabase
        .from("Account")
        .delete()
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId)

      if (error) throw error
    },

    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await supabase
        .from("Session")
        .insert({
          id: crypto.randomUUID(),
          sessionToken,
          userId,
          expires: expires.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: new Date(data.expires),
      }
    },

    async getSessionAndUser(sessionToken) {
      const { data, error } = await supabase
        .from("Session")
        .select(`
          id,
          sessionToken,
          userId,
          expires,
          User (
            id,
            email,
            name,
            image,
            emailVerified
          )
        `)
        .eq("sessionToken", sessionToken)
        .maybeSingle()

      if (error) throw error
      if (!data?.User) return null

      const user = Array.isArray(data.User) ? data.User[0] : data.User

      return {
        session: {
          id: data.id,
          sessionToken: data.sessionToken,
          userId: data.userId,
          expires: new Date(data.expires),
        },
        user: {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        },
      }
    },

    async updateSession({ sessionToken, expires, userId }) {
      const { data, error } = await supabase
        .from("Session")
        .update({
          expires: expires?.toISOString(),
          userId,
        })
        .eq("sessionToken", sessionToken)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: new Date(data.expires),
      }
    },

    async deleteSession(sessionToken) {
      const { error } = await supabase
        .from("Session")
        .delete()
        .eq("sessionToken", sessionToken)

      if (error) throw error
    },

    async createVerificationToken({ identifier, expires, token }) {
      const { data, error } = await supabase
        .from("VerificationToken")
        .insert({
          identifier,
          token,
          expires: expires.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return {
        identifier: data.identifier,
        token: data.token,
        expires: new Date(data.expires),
      }
    },

    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabase
        .from("VerificationToken")
        .delete()
        .eq("identifier", identifier)
        .eq("token", token)
        .select()
        .single()

      if (error) throw error

      return {
        identifier: data.identifier,
        token: data.token,
        expires: new Date(data.expires),
      }
    },
  }
}
