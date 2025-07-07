import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteCategory = async (categoryId: string) => {
  const response = await fetch(
    routeIndexFront + `/api/category/${categoryId}`,
    {
      method: "DELETE",
    }
  );
};

export function useMutationDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteCategoryMutation = async (categoryId: string) => {
    try {
      const response = await deleteCategory(categoryId);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la suppression de la Catégorie."
      );
    }
  };

  const mutation = useMutation(deleteCategoryMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression de la Catégorie.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "La Catégorie a bien été supprimé.",
      });
      queryClient.refetchQueries(["categoriesAdmin"]);
    },
  });

  return mutation;
}
