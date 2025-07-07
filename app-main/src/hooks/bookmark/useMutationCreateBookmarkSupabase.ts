import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryCreateBookmark {
  title: string;
  url: string;
  tags?: string[];
  description: string;
  image?: string;
  categoryId: string;
}

const createBookmarkSupabase = async (bookmark: QueryCreateBookmark) => {
  const response = await fetch(routeIndexFront + "/api/bookmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: bookmark.title,
      url: bookmark.url,
      tags: bookmark.tags,
      description: bookmark.description,
      image: bookmark.image,
      categoryId: bookmark.categoryId,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création du bookmark');
  }

  return response.json();
};

export function useMutationCreateBookmarkSupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createBookmarkSupabase,
    onError: (error) => {
      console.error('Erreur lors de la création du bookmark:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du bookmark.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le bookmark a été créé avec succès.",
      });
      // Invalider les queries pour refetch les données
      queryClient.invalidateQueries({ queryKey: ["bookmarksUserSupabase"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksDomain"] });
    },
  });

  return mutation;
}
