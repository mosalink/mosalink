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
        "Une erreur est survenue lors de l'ajout d'un bookmark dans un dossier."
      );
    }
  };

  const mutation = useMutation(addBookmarkToFolderMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'ajout d'un bookmark dans un dossier.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark à bien été ajouté au dossier.",
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
