import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryCreateCategory {
  name: string;
  url: string;
}

const createCategory = async (category: QueryCreateCategory) => {
  const response = await fetch(routeIndexFront + "/api/category", {
    method: "POST",
    body: JSON.stringify({
      name: category.name,
      url: category.url,
    }),
  });
};

export function useMutationCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCategoryMutation = async (category: QueryCreateCategory) => {
    try {
      const response = await createCategory(category);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la création de la Catégorie."
      );
    }
  };

  const mutation = useMutation(createCategoryMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de la Catégorie.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "La Catégorie a bien été créé.",
      });
      queryClient.refetchQueries(["categoriesAdmin"]);
    },
  });

  return mutation;
}
