import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryCreateFolder {
  name: string;
  url: string;
}

const createFolder = async (folder: QueryCreateFolder) => {
  const response = await fetch(routeIndexFront + "/api/folder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folder.name,
      url: folder.url,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la création du projet");
  }

  return response.json();
};

export function useMutationCreateFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createFolderMutation = async (folder: QueryCreateFolder) => {
    try {
      const response = await createFolder(folder);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: createFolderMutation,
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du projet.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["foldersUser"]);
      toast({
        title: "Félicitations",
        description: "Le projet a bien été créé.",
      });
    },
  });

  return mutation;
}
