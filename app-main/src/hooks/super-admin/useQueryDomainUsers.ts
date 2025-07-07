import { useQuery } from "@tanstack/react-query";

export interface DomainUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  creationDate: string;
  lastUpdateDate: string;
}

export function useQueryDomainUsers(domainId: string) {
  return useQuery({
    queryKey: ["domain-users", domainId],
    queryFn: async (): Promise<DomainUser[]> => {
      const response = await fetch(`/api/super-admin/domains/${domainId}/users`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la récupération des utilisateurs");
      }
      
      return response.json();
    },
    enabled: !!domainId,
  });
}
