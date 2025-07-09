import { getServerSession } from "next-auth";
import supabase from "../../../lib/supabase";
import { redirect } from "next/navigation";
import { routeDomainFront } from "@/utils/routes/routesFront";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Login from "@/components/specific/Login";

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
          Domain(url)
        `)
        .eq('email', session.user.email)
        .single();

      if (!userError && user?.Domain && Array.isArray(user.Domain) && user.Domain.length > 0) {
        return redirect(routeDomainFront(user.Domain[0].url));
      }
      
      if (!userError && user) {
        return redirect('/');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du domaine:', error);
    }
    
    return redirect('/');
  }

  return <Login />;
}
