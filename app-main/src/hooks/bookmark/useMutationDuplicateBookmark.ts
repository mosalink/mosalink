import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const duplicateBookmark = async (bookmarkId: string) => {
  const response = await fetch(routeIndexFront + "/api/bookmark/duplicate-supabase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookmarkId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la duplication");
  }

  return response.json();
};

export function useMutationDuplicateBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDuplicateBookmarkMutation = async (bookmarkId: string) => {
    try {
      const response = await duplicateBookmark(bookmarkId);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la duplication du bookmark."
      );
    }
  };
  const mutation = useMutation(createDuplicateBookmarkMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la duplication du bookmark.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark a bien été dupliqué.",
      });
      queryClient.refetchQueries(["bookmarksDomain"]);
    },
  });

  return mutation;
}
