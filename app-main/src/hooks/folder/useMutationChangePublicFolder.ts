import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryChangePublicFolder {
  id: string;
  isPubish: boolean;
}

const changePublicFolder = async (folder: QueryChangePublicFolder) => {
  const response = await fetch(routeIndexFront + `/api/folder/change-public`, {
    method: "PUT",
    body: JSON.stringify({
      id: folder.id,
      isPublish: folder.isPubish,
    }),
  });

  return response.json();
};

export function useMutationChangePublicFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const changePublicFolderMutation = async (
    folder: QueryChangePublicFolder
  ) => {
    try {
      const response = await changePublicFolder(folder);
      return response;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la modification du dossier."
      );
    }
  };

  const mutation = useMutation(changePublicFolderMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la modification du dossier.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le dossier a bien été modifié.",
      });
      queryClient.refetchQueries(["foldersUser"]);
    },
  });

  return mutation;
}
