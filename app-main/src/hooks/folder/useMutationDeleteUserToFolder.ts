import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryDeleteUserFromProject {
  userId: string;
  folderId: string;
}

const deleteUserFromProject = async (project: QueryDeleteUserFromProject) => {
  const response = await fetch(routeIndexFront + "/api/folder/user", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: project.userId,
      folderId: project.folderId,
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'utilisateur du projet");
  }

  return response.json();
};

export function useMutationDeleteUserToFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: deleteUserFromProject,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression d'un utilisateur du projet.",
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Félicitations",
        description: "L'utilisateur a bien été supprimé du projet.",
      });
      queryClient.invalidateQueries({ queryKey: ["foldersUser"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksFolderDomain", variables.folderId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksFolder", variables.folderId] }); // Ajout de cette line pour le dialog UserProjet
    },
  });

  return mutation;
}
