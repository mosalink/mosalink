import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useMutationAddUserToFolder } from "./useMutationAddUserToFolder";

interface UseProjectMembershipFixProps {
  folderId: string;
  userCreatorId?: string;
  users?: Array<{ id: string; email: string }>;
  onSuccess?: () => void;
}

export function useProjectMembershipFix({
  folderId,
  userCreatorId,
  users,
  onSuccess
}: UseProjectMembershipFixProps) {
  const [isFixing, setIsFixing] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const addUserToFolderMutation = useMutationAddUserToFolder();

  const isCreatorInMembersList = users?.some(user => user.id === userCreatorId);
  const isCurrentUserCreator = session?.user?.id === userCreatorId;
  const shouldShowFixButton = isCurrentUserCreator && !isCreatorInMembersList && userCreatorId;

  const fixProjectMembership = useCallback(async () => {
    if (!session?.user?.id || !userCreatorId) return;
    
    setIsFixing(true);
    try {
      await addUserToFolderMutation.mutateAsync({
        folderId,
        userId: session.user.id,
      });
      
      if (onSuccess) {
        await onSuccess();
      }
      
      toast({
        title: "Projet corrigé !",
        description: "Vous avez été ajouté à la liste des membres de votre projet.",
      });
    } catch (error) {
      console.error("Erreur lors de la correction du projet:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous ajouter au projet. Veuillez réessayer.",
      });
    } finally {
      setIsFixing(false);
    }
  }, [session?.user?.id, userCreatorId, folderId, addUserToFolderMutation, onSuccess, toast]);

  return {
    isFixing,
    shouldShowFixButton,
    fixProjectMembership,
    isCurrentUserCreator,
    isCreatorInMembersList
  };
}
