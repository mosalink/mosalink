import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryAddBookmarkToFolder {
  bookmarkId: string;
  folderId: string;
}

const deleteBookmarkToFolder = async (folder: QueryAddBookmarkToFolder) => {
  const response = await fetch(routeIndexFront + "/api/folder/bookmark", {
    method: "DELETE",
    body: JSON.stringify({
      bookmarkId: folder.bookmarkId,
      folderId: folder.folderId,
    }),
  });
};

export function useMutationDeleteBookmarkToFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteBookmarkToFolderMutation = async (
    folder: QueryAddBookmarkToFolder
  ) => {
    try {
      const response = await deleteBookmarkToFolder(folder);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la suppression d'un bookmark dans un dossier."
      );
    }
  };

  const mutation = useMutation(deleteBookmarkToFolderMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression d'un bookmark dans un dossier.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark à bien été supprimé au dossier.",
      });
      queryClient.refetchQueries([
        "foldersUser",
        "bookmarksDomain",
        "bookmarksCategoryDomain",
        "bookmarksTagsDomain",
        "bookmarksUserDomain",
      ]);
    },
  });

  return mutation;
}
