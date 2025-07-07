import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryModifyCategory {
  id: string;
  name: string;
  url: string;
}

const modifyCategorySupabase = async (category: QueryModifyCategory) => {
  const response = await fetch(routeIndexFront + `/api/category/supabase/${category.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: category.name,
      url: category.url,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la modification de la catégorie');
  }

  return response.json();
};

export function useMutationModifyCategorySupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: modifyCategorySupabase,
    onError: (error) => {
      console.error('Erreur lors de la modification de la catégorie:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de la catégorie.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La catégorie a été modifiée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["categoriesAdmin"] });
    },
  });

  return mutation;
}
