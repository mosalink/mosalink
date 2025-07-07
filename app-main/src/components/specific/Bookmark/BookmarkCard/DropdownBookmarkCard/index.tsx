import { Button } from "@/components/ui/button";
import { BookmarkData } from "@/hooks/bookmark/useQueryBookmarksUserSupabase";
import {
  Copy,
  Folder,
  FolderClosed,
  FolderX,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import BookmarkModif from "../../BookmarkModif";
import { useQueryFoldersUser } from "@/hooks/folder/useQueryFoldersUser";
import { canModifBookmark } from "@/utils/roles/utils";
import { useSession } from "next-auth/react";
import { SetStateAction, useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutationDuplicateBookmarkSupabase } from "@/hooks/bookmark/useMutationDuplicateBookmarkSupabase";
import { useMutationDeleteBookmarkSupabase } from "@/hooks/bookmark/useMutationDeleteBookmarkSupabase";
import AddBookmarkInFolder from "@/components/specific/Folder/AddBookmark";
import { useMutationDeleteBookmarkToFolder } from "@/hooks/folder/useMutationDeleteBookmarkToFolder";

interface Props {
  bookmark: BookmarkData;
  folderId?: string;
}

const DropdownBookmarkCard = ({ bookmark, folderId }: Props) => {
  const deleteBookmarkMutation = useMutationDeleteBookmarkSupabase();
  const duplicateBookmarkMutation = useMutationDuplicateBookmarkSupabase();
  const deleteBookmarkToFolderMutation = useMutationDeleteBookmarkToFolder();
  const { data: folderData, isLoading, isError } = useQueryFoldersUser();
  const session = useSession();

  const [openDialog, setOpenDialog] = useState(false);
  const [contentDialog, setContentDialog] = useState("");

  const handleDuplicateBookmark = useCallback(() => {
    duplicateBookmarkMutation.mutate(bookmark.id);
  }, [bookmark.id, duplicateBookmarkMutation]);

  const handleDeleteBookmarkToFolder = useCallback(() => {
    deleteBookmarkToFolderMutation.mutate({
      bookmarkId: bookmark.id,
      folderId: folderId ?? "",
    });
  }, [bookmark.id, deleteBookmarkToFolderMutation, folderId]);

  const userModifContent = useMemo(() => {
    if (
      !session?.data?.user?.id ||
      !session?.data?.user?.domainId ||
      !canModifBookmark(
        {
          role: session?.data?.user.role,
          domainId: session?.data?.user.domainId,
          id: session?.data?.user.id,
        },
        { id: bookmark.user.id, domainId: bookmark.id }
      )
    ) {
      return null;
    }

    return (
      <>
        <DialogTrigger asChild>
          <DropdownMenuItem onClick={() => setContentDialog("modif")}>
            <div className="flex gap-2">
              <Pencil className="w-4 h-4" />
              Modifier
            </div>
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogTrigger asChild>
          <DropdownMenuItem onClick={() => setContentDialog("folder")}>
            <div className="flex gap-2">
              <Folder className="w-4 h-4" />
              Ajouter à un projet
            </div>
          </DropdownMenuItem>
        </DialogTrigger>
        {folderId && (
          <DropdownMenuItem onClick={() => handleDeleteBookmarkToFolder()}>
            <div className="flex gap-2 items-center">
              <FolderX className="w-4 h-4" />
              Supprimer du projet
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={(e) => {
            if (bookmark.id) {
              deleteBookmarkMutation.mutate(bookmark.id);
            }
            e.stopPropagation();
          }}
        >
          <div className="flex gap-2">
            <Trash2 className="w-4 h-4" />
            Supprimer
          </div>
        </DropdownMenuItem>
      </>
    );
  }, [
    session?.data?.user.role,
    session?.data?.user.domainId,
    session?.data?.user.id,
    bookmark.user.id,
    bookmark.id,
    folderId,
    handleDeleteBookmarkToFolder,
    deleteBookmarkMutation,
  ]);

  const otherUserContent = useMemo(() => {
    if (bookmark.user.id === session?.data?.user.id) {
      return null;
    }
    return (
      <DropdownMenuItem onClick={handleDuplicateBookmark}>
        <div className="flex gap-2">
          <Copy className="w-4 h-4" />
          Dupliquer
        </div>
      </DropdownMenuItem>
    );
  }, [bookmark.user.id, handleDuplicateBookmark, session?.data?.user.id]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {otherUserContent}
          {userModifContent}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        {contentDialog === "modif" ? (
          <BookmarkModif bookmark={bookmark} setOpenDialog={setOpenDialog} />
        ) : contentDialog === "folder" ? (
          <AddBookmarkInFolder
            bookmarkId={bookmark.id}
            setOpenDialog={setOpenDialog}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default DropdownBookmarkCard;
