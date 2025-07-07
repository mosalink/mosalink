import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryAddBookmarkToFolder {
  bookmarkId: string;
  folderId: string;
}

const addBookmarkToFolderSupabase = async (folder: QueryAddBookmarkToFolder) => {
  const response = await fetch(routeIndexFront + "/api/folder/bookmark-supabase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bookmarkId: folder.bookmarkId,
      folderId: folder.folderId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de l'ajout du bookmark au projet");
  }

  return response.json();
};

export function useMutationAddBookmarkToFolderSupabase() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addBookmarkToFolderMutation = async (folder: QueryAddBookmarkToFolder) => {
    try {
      const response = await addBookmarkToFolderSupabase(folder);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: addBookmarkToFolderMutation,
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du bookmark au projet.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark a bien été ajouté au projet.",
      });
      queryClient.invalidateQueries(["foldersUser"]);
      queryClient.invalidateQueries(["bookmarksDomain"]);
    },
  });

  return mutation;
}
