import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddAdminData {
  domainId: string;
  email: string;
  name?: string;
}

export function useMutationAddDomainAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, email, name }: AddAdminData) => {
      const response = await fetch(`/api/super-admin/domains/${domainId}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'ajout de l'administrateur");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-domains"] });
    },
  });
}
