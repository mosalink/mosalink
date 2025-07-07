import { useQuery } from "@tanstack/react-query";

export interface DomainWithDetails {
  id: string;
  name: string;
  url: string;
  isPublish: boolean;
  maximumCategories: number;
  creationDate: string;
  lastUpdateDate: string;
  users: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    creationDate: string;
  }[];
  _count: {
    users: number;
    categories: number;
    bookmark: number;
  };
}

export function useQuerySuperAdminDomains() {
  return useQuery({
    queryKey: ["super-admin-domains"],
    queryFn: async (): Promise<DomainWithDetails[]> => {
      const response = await fetch("/api/super-admin/domains");
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la récupération des domaines");
      }
      
      return response.json();
    },
  });
}
