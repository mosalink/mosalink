"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuerySuperAdminDomains } from "@/hooks/super-admin/useQuerySuperAdminDomains";
import { isSuperAdmin } from "@/utils/roles/utils";
import CreateDomainDialog from "@/components/specific/SuperAdmin/CreateDomainDialog";
import DomainCard from "@/components/specific/SuperAdmin/DomainCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, RefreshCw, Plus } from "lucide-react";
import UserNav from "@/components/specific/Header/UserNav";

export default function SuperAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: domains, isLoading, isError, refetch } = useQuerySuperAdminDomains();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!isSuperAdmin(session.user)) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || !isSuperAdmin(session.user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Interface Super Administrateur
                </h1>
                <p className="text-sm text-gray-600">
                  Gestion globale des domaines Mosalink
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
              <CreateDomainDialog />
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">
              Impossible de charger les domaines. Veuillez réessayer.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : !domains || domains.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun domaine
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par créer votre premier domaine.
            </p>
            <CreateDomainDialog />
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Domaines ({domains.length})
              </h2>
              <p className="text-gray-600">
                Gérez tous les domaines de la plateforme Mosalink
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {domains.map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
