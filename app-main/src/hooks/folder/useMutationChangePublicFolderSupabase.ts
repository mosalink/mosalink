import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryChangePublicFolder {
  id: string;
  isPubish: boolean;
}

const changePublicFolderSupabase = async (folder: QueryChangePublicFolder) => {
  const response = await fetch(routeIndexFront + `/api/folder/change-public-supabase`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: folder.id,
      isPublish: folder.isPubish,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la modification du statut public/privé');
  }

  return response.json();
};

export function useMutationChangePublicFolderSupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: changePublicFolderSupabase,
    onError: (error) => {
      console.error('Erreur lors de la modification du folder:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut public/privé.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le statut public/privé du projet a bien été modifié.",
      });
      // Invalider les queries pour refetch les données
      queryClient.invalidateQueries({ queryKey: ["foldersUser"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksFolderSupabase"] });
    },
  });

  return mutation;
}
