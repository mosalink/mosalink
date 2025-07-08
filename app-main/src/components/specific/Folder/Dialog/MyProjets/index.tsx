import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import { useQueryFoldersUser } from "@/hooks/folder/useQueryFoldersUser";
import { routeFolderFront } from "@/utils/routes/routesFront";
import { Users, Crown, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import AddFolder from "../../AddFolder";
import { useMutationDeleteFolder } from "@/hooks/folder/useMutationDeleteFolder";
import UserProjet from "../UserProjet";

const MyProjets = () => {
  const { data: foldersData } = useQueryFoldersUser();
  const deleteFolderMutation = useMutationDeleteFolder();
  const { data: sessionData } = useSession();

  const ownedProjects = useMemo(() => {
    return foldersData?.filter(folder => folder.userCreatorId === sessionData?.user.id) || [];
  }, [foldersData, sessionData?.user.id]);

  const memberProjects = useMemo(() => {
    return foldersData?.filter(folder => folder.userCreatorId !== sessionData?.user.id) || [];
  }, [foldersData, sessionData?.user.id]);

  const canUserCreateFolder = useMemo(() => {
    if (!ownedProjects) {
      return true;
    }

    if (ownedProjects.length < 4) {
      return true;
    }

    return false;
  }, [ownedProjects]);

  const handleDeleteFolder = useCallback(
    (folderId: string) => {
      deleteFolderMutation.mutate(folderId);
    },
    [deleteFolderMutation]
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Mes projets</DialogTitle>
      </DialogHeader>
      <DialogDescription asChild>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-md text-slate-900 font-bold">
                {foldersData?.length || 0} projet(s) au total
              </p>
              <p className="text-sm text-gray-500">
                {ownedProjects.length} créé(s) • {memberProjects.length} en tant que membre
              </p>
            </div>
          </div>
          {foldersData?.map((folder) => {
            const isOwner = folder.userCreatorId === sessionData?.user.id;
            return (
              <div
                key={folder.id}
                className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isOwner 
                      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' 
                      : 'bg-gradient-to-br from-blue-100 to-blue-200'
                  }`}>
                    {isOwner ? (
                      <Crown className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <UserPlus className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <DialogTrigger asChild>
                      <Link
                        href={routeFolderFront(
                          sessionData?.user.domainUrl || "",
                          folder.id
                        )}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {folder.name}
                      </Link>
                    </DialogTrigger>
                    <p className={`text-xs ${
                      isOwner ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {isOwner ? 'Propriétaire' : 'Membre invité'}
                    </p>
                  </div>
                  {isOwner && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={"ghost"} size={"sm"} title="Gérer les membres">
                          <Users className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <UserProjet folderId={folder.id} />
                    </Dialog>
                  )}
                </div>
                {isOwner && (
                  <Button
                    variant={"link"}
                    className="text-red-500 text-sm font-bold cursor-pointer"
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            );
          })}
          {canUserCreateFolder ? (
            <AddFolder />
          ) : (
            <p className="text-sm text-gray-500">Vous avez déjà créé 4 projets</p>
          )}
        </div>
      </DialogDescription>
    </DialogContent>
  );
};

export default MyProjets;
