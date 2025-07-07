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
import { Users } from "lucide-react";
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

  const canUserCreateFolder = useMemo(() => {
    const folders = foldersData?.filter((folder) => {
      return folder.userCreatorId === sessionData?.user.id;
    });

    if (!folders) {
      return true;
    }

    if (folders.length < 4) {
      return true;
    }

    return false;
  }, [foldersData, sessionData?.user.id]);

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
        <div className="flex flex-col gap-2 py-4">
          <div className="flex items-center justify-between">
            <p className="text-md text-slate-900 font-bold">
              Mes {foldersData?.length ?? "0"} projet(s)
            </p>
          </div>
          {foldersData?.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-4">
                <DialogTrigger asChild>
                  <Link
                    href={routeFolderFront(
                      sessionData?.user.domainUrl || "",
                      folder.id
                    )}
                    className="text-sm"
                  >
                    {folder.name}
                  </Link>
                </DialogTrigger>
                {folder.userCreatorId === sessionData?.user.id && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"ghost"} size={"sm"}>
                        <Users className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <UserProjet folderId={folder.id} />
                  </Dialog>
                )}
              </div>
              {folder.userCreatorId === sessionData?.user.id && (
                <Button
                  variant={"link"}
                  className="text-red-500 text-sm font-bold cursor-pointer"
                  onClick={() => handleDeleteFolder(folder.id)}
                >
                  Supprimer
                </Button>
              )}
            </div>
          ))}
          {canUserCreateFolder ? (
            <AddFolder />
          ) : (
            <p className="text-sm">Vous avez déjà créé 4 projets</p>
          )}
        </div>
      </DialogDescription>
    </DialogContent>
  );
};

export default MyProjets;
