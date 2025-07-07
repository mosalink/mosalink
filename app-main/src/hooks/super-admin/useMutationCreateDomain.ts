import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateDomainData {
  name: string;
  url: string;
  isPublish?: boolean;
  maximumCategories?: number;
  adminEmail?: string;
}

export function useMutationCreateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDomainData) => {
      const response = await fetch("/api/super-admin/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création du domaine");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-domains"] });
    },
  });
}
