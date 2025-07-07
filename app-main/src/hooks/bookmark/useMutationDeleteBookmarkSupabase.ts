import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteBookmarkSupabase = async (bookmarkId: string) => {
  const response = await fetch(routeIndexFront + `/api/bookmark/delete-supabase/${bookmarkId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la suppression");
  }

  return response.json();
};

export function useMutationDeleteBookmarkSupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteBookmarkMutation = async (bookmarkId: string) => {
    try {
      const response = await deleteBookmarkSupabase(bookmarkId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: deleteBookmarkMutation,
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du bookmark.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark a bien été supprimé.",
      });
      queryClient.refetchQueries(["bookmarksDomain"]);
    },
  });

  return mutation;
}
