import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutationDeleteDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId: string) => {
      const response = await fetch(`/api/super-admin/domains/${domainId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression du domaine");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-domains"] });
    },
  });
}
