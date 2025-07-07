import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteFolder = async (folderId: string) => {
  const response = await fetch(routeIndexFront + `/api/folder/${folderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la suppression du projet");
  }

  return response.json();
};

export function useMutationDeleteFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteFolderMutation = async (folderId: string) => {
    try {
      const response = await deleteFolder(folderId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: deleteFolderMutation,
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du projet.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le projet a bien été supprimé.",
      });
      queryClient.refetchQueries(["foldersUser"]);
    },
  });

  return mutation;
}
