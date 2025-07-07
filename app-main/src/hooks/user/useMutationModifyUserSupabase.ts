import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryModifyUser {
  id: string;
  email: string;
  role: string;
}

const modifyUserSupabase = async (user: QueryModifyUser) => {
  const response = await fetch(routeIndexFront + `/api/user/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      role: user.role,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la modification de l\'utilisateur');
  }

  return response.json();
};

export function useMutationModifyUserSupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: modifyUserSupabase,
    onError: (error) => {
      console.error('Erreur lors de la modification de l\'utilisateur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'utilisateur.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'utilisateur a été modifié avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["usersDomain"] });
    },
  });

  return mutation;
}
