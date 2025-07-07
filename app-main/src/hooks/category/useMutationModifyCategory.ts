import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryModifyCategory {
  name: string;
  url: string;
  id: string;
}

const modifyCategory = async (category: QueryModifyCategory) => {
  const response = await fetch(
    routeIndexFront + "/api/category/" + category.id,
    {
      method: "PUT",
      body: JSON.stringify({
        name: category.name,
        url: category.url,
      }),
    }
  );
};

export function useMutationModifyCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const modifyCategoryMutation = async (category: QueryModifyCategory) => {
    try {
      const response = await modifyCategory(category);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la modification de la Catégorie."
      );
    }
  };

  const mutation = useMutation(modifyCategoryMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la modification de la Catégorie.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "La Catégorie a bien été modifié.",
      });
      queryClient.refetchQueries(["categoriesAdmin"]);
    },
  });

  return mutation;
}
