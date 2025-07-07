import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { routeDomainFront } from "@/utils/routes/routesFront";
import Header from "@/components/specific/Header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Footer from "@/components/specific/Footer";
import { supabaseAdmin } from "../../../lib/supabase";

export interface ParamsDomainRoute {
  params: {
    domain: string;
  };
}

interface Props extends ParamsDomainRoute {
  children: React.ReactNode;
}

export default async function Layout({ children, params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }

  const { data: requestedDomain, error } = await supabaseAdmin
    .from('Domain')
    .select('id, name, url, isPublish, maximumCategories, creationDate, lastUpdateDate')
    .eq('url', params.domain)
    .eq('isPublish', true)
    .single();

  if (error || !requestedDomain) {
    console.error('Erreur lors de la récupération du domaine:', error);
    return redirect("/");
  }

  const { data: userAccess, error: userError } = await supabaseAdmin
    .from('User')
    .select('id')
    .eq('id', session.user.id)
    .eq('domainId', requestedDomain.id)
    .single();

  if (userError || !userAccess) {
    console.error('Utilisateur non autorisé pour ce domaine:', userError);
    return redirect("/");
  }

  return (
    <div>
      <Header currentDomain={requestedDomain} />
      {children}
      <Footer />
    </div>
  );
}
