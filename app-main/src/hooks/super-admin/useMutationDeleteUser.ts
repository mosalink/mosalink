import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutationDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/super-admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression de l'utilisateur");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domain-users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-domains"] });
    },
  });
}
