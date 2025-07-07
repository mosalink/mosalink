import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface QueryAddUserToProject {
  userId: string;
  folderId: string;
}

const addUserToProject = async (project: QueryAddUserToProject) => {
  const response = await fetch(routeIndexFront + "/api/folder/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: project.userId,
      folderId: project.folderId,
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout de l'utilisateur au projet");
  }

  return response.json();
};

export function useMutationAddUserToFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: addUserToProject,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'ajout d'un utilisateur au projet.",
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Félicitations",
        description: "L'utilisateur a bien été ajouté au projet.",
      });
      queryClient.invalidateQueries({ queryKey: ["foldersUser"] });
      queryClient.invalidateQueries({ queryKey: ["usersDomain"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksFolderDomain", variables.folderId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarksFolder", variables.folderId] }); // Ajout de cette line pour le dialog UserProjet
    },
  });

  return mutation;
}
