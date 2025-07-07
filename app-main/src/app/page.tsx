import { getServerSession } from "next-auth";
import { supabaseAdmin } from "../../lib/supabase";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { routeDomainFront } from "@/utils/routes/routesFront";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/utils/roles/utils";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  if (isSuperAdmin(session.user)) {
    return redirect("/super-admin");
  }

  const { data: allDomains, error: domainsError } = await supabaseAdmin
    .from('Domain')
    .select('id, name, url, isPublish')
    .eq('isPublish', true)
    .order('name', { ascending: true });

  if (domainsError) {
    console.error('Erreur lors de la récupération des domaines:', domainsError);
    return <div>Erreur lors du chargement des domaines: {domainsError.message}</div>;
  }

  const { data: userDomains, error: userError } = await supabaseAdmin
    .from('User')
    .select('domainId')
    .eq('id', session.user.id)
    .single();

  if (userError) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', userError);
    return <div>Erreur lors du chargement des données utilisateur</div>;
  }

  const domains = allDomains?.filter(domain => domain.id === userDomains?.domainId) || [];

  const enrichedDomains = domains.map(domain => ({
    ...domain,
    _count: {
      users: 0,
      bookmark: 0,
      categories: 0
    }
  }));

  const isSingle = enrichedDomains.length === 1;

  return (
    <main className="flex flex-col gap-8 w-full min-h-screen justify-center items-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Bienvenue sur {process.env.NEXT_PUBLIC_APP_NAME}
        </h1>
      </div>

      <div
        className={
          isSingle
            ? "flex justify-center w-full"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl"
        }
      >
        {enrichedDomains.map((domain) => (
          <Link key={domain.id} href={routeDomainFront(domain.url)}>
            <div className="group border rounded-lg shadow-sm hover:shadow-md transition-all p-6 bg-white mx-auto">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900">{domain.name}</h3>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-2 group-hover:text-blue-500 transition-all" />
                </div>
                
                <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                  /{domain.url}
                </p>
                
                {!isSingle && (
                  <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                    <span>{domain._count.users} utilisateurs</span>
                    <span>{domain._count.bookmark} bookmarks</span>
                    <span>{domain._count.categories} catégories</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {enrichedDomains.length === 0 && (
        <div className="text-center text-gray-500">
          <p>Aucun domaine disponible pour le moment.</p>
        </div>
      )}
    </main>
  );
}
