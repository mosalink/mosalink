import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryCreateUser {
  email: string;
  role: string;
}

const createUserSupabase = async (user: QueryCreateUser) => {
  const response = await fetch(routeIndexFront + "/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      role: user.role,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de l\'utilisateur');
  }

  return response.json();
};

export function useMutationCreateUserSupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createUserSupabase,
    onError: (error) => {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'utilisateur a été créé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["usersDomain"] });
    },
  });

  return mutation;
}
