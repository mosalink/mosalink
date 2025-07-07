import { getServerSession } from "next-auth";
import supabase from "../../../lib/supabase";
import { redirect } from "next/navigation";
import { routeDomainFront } from "@/utils/routes/routesFront";
import Login from "@/components/specific/Login";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    try {
      const { data: user, error: userError } = await supabase
        .from('User')
        .select(`
          id,
          email,
          domainId,
          domain:Domain(url)
        `)
        .eq('email', session.user.email)
        .single();

      if (!userError && user?.domain && Array.isArray(user.domain) && user.domain.length > 0) {
        return redirect(routeDomainFront(user.domain[0].url));
      }
      
      if (!userError && user) {
        return redirect('/');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du domaine:', error);
    }
    
    return redirect('/');
  }

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center gap-8">
      <h1 className="font-bold text-2xl">
        Bienvenue sur {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <Login />
    </div>
  );
}
