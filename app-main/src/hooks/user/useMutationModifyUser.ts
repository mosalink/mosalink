import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark, Category, Role } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryModifyUser {
  email: string;
  role: Role;
  id: string;
}

const modifyUser = async (user: QueryModifyUser) => {
  const response = await fetch(routeIndexFront + "/api/user/" + user.id, {
    method: "PUT",
    body: JSON.stringify({
      email: user.email,
      role: user.role,
      id: user.id,
    }),
  });
};

export function useMutationModifyUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const modifyUserMutation = async (user: QueryModifyUser) => {
    try {
      const response = await modifyUser(user);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la modification de l'utilisateur."
      );
    }
  };

  const mutation = useMutation(modifyUserMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la modification de l'utilisateur.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "L'utilisateur a bien été modifié.",
      });
      queryClient.refetchQueries(["usersDomain"]);
    },
  });

  return mutation;
}
