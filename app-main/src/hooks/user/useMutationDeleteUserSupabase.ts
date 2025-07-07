import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteUserSupabase = async (id: string) => {
  const response = await fetch(routeIndexFront + `/api/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }

  return response.json();
};

export function useMutationDeleteUserSupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: deleteUserSupabase,
    onError: (error) => {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["usersDomain"] });
    },
  });

  return mutation;
}
