import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryCreateCategory {
  name: string;
  url: string;
}

const createCategorySupabase = async (category: QueryCreateCategory) => {
  const response = await fetch(routeIndexFront + "/api/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: category.name,
      url: category.url,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de la catégorie');
  }

  return response.json();
};

export function useMutationCreateCategorySupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createCategorySupabase,
    onError: (error) => {
      console.error('Erreur lors de la création de la catégorie:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la catégorie.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La catégorie a été créée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["categoriesAdmin"] });
    },
  });

  return mutation;
}
