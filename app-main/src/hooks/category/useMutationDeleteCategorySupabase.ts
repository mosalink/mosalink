import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteCategorySupabase = async (id: string) => {
  const response = await fetch(routeIndexFront + `/api/category/supabase/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la catégorie');
  }

  return response.json();
};

export function useMutationDeleteCategorySupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: deleteCategorySupabase,
    onError: (error) => {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la catégorie.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La catégorie a été supprimée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["categoriesAdmin"] });
    },
  });

  return mutation;
}
