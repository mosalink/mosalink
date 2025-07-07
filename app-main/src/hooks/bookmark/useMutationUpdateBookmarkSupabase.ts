import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryUpdateBookmark {
  id: string;
  title: string;
  url: string;
  tags?: string[];
  description: string;
  image?: string;
  categoryId: string;
}

const updateBookmarkSupabase = async (bookmark: QueryUpdateBookmark) => {
  const response = await fetch(routeIndexFront + `/api/bookmark/update-supabase/${bookmark.id}`, {
    method: "PUT",
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
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la mise à jour");
  }

  return response.json();
};

export function useMutationUpdateBookmarkSupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBookmarkMutation = async (bookmark: QueryUpdateBookmark) => {
    try {
      const response = await updateBookmarkSupabase(bookmark);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: updateBookmarkMutation,
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du bookmark.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark a bien été mis à jour.",
      });
      queryClient.refetchQueries(["bookmarksDomain"]);
    },
  });

  return mutation;
}
