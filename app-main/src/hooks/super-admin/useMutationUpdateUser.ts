import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateUserData {
  id: string;
  data: {
    name?: string;
    role?: "USER" | "ADMIN";
  };
}

export function useMutationUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateUserData) => {
      const response = await fetch(`/api/super-admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la modification de l'utilisateur");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domain-users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-domains"] });
    },
  });
}
