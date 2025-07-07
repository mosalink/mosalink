import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteUser = async (userId: string) => {
  const response = await fetch(routeIndexFront + `/api/user/${userId}`, {
    method: "DELETE",
  });
};

export function useMutationDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteUserMutation = async (userId: string) => {
    try {
      const response = await deleteUser(userId);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la suppression de l'utilisateur."
      );
    }
  };

  const mutation = useMutation(deleteUserMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression de l'utilisateur.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "L'utilisateur a bien été supprimé.",
      });
      queryClient.refetchQueries(["usersDomain"]);
    },
  });

  return mutation;
}
