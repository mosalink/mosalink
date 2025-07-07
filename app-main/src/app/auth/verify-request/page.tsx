import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import supabase from "../../../../lib/supabase";
import { redirect } from "next/navigation";
import { routeDomainFront } from "@/utils/routes/routesFront";

const VerifyRequestPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    try {
      const { data: user, error: userError } = await supabase
        .from('User')
        .select(`
          id,
          email,
          domainId,
          domain:Domain!inner(url)
        `)
        .eq('email', session.user.email)
        .single();

      if (!userError && user?.domain && Array.isArray(user.domain) && user.domain.length > 0) {
        return redirect(routeDomainFront(user.domain[0].url));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du domaine:', error);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8">
      <Mail className="h-12 w-12" />
      <h1 className="font-bold text-2xl">
        Vous avez reçu un lien de connection
      </h1>
      <p>Regardez dans votre boîte mail</p>
    </div>
  );
};

export default VerifyRequestPage;
