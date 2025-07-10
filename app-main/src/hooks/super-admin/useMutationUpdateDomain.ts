import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateDomainData {
  id: string;
  name: string;
  url: string;
  isPublish: boolean;
  maximumCategories: number;
}

export function useMutationUpdateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateDomainData) => {
      const response = await fetch(`/api/super-admin/domains/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          url: data.url,
          isPublish: data.isPublish,
          maximumCategories: data.maximumCategories,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la modification du domaine");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-domains"] });
    },
  });
}
