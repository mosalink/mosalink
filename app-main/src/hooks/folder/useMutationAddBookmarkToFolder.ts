import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryAddBookmarkToFolder {
  bookmarkId: string;
  folderId: string;
}

const addBookmarkToFolder = async (folder: QueryAddBookmarkToFolder) => {
  const response = await fetch(routeIndexFront + "/api/folder/bookmark", {
    method: "POST",
    body: JSON.stringify({
      bookmarkId: folder.bookmarkId,
      folderId: folder.folderId,
    }),
  });
};

export function useMutationAddBookmarkToFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addBookmarkToFolderMutation = async (
    folder: QueryAddBookmarkToFolder
  ) => {
    try {
      const response = await addBookmarkToFolder(folder);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de l'ajout d'un bookmark dans un projet."
      );
    }
  };

  const mutation = useMutation({
    mutationFn: addBookmarkToFolderMutation,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'ajout d'un bookmark dans un projet.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark à bien été ajouté au projet.",
      });
      queryClient.invalidateQueries({ queryKey: ["foldersUser"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksDomain"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksCategoryDomain"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksTagsDomain"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksUserDomain"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksUserSupabase"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksFolderSupabase"] });
    },
  });

  return mutation;
}
