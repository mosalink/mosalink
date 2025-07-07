import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateUserData {
  email: string;
  name?: string;
  role: "USER" | "ADMIN";
  domainId: string;
}

export function useMutationCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await fetch(`/api/super-admin/domains/${data.domainId}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création de l'utilisateur");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["domain-users", variables.domainId] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-domains"] });
    },
  });
}
