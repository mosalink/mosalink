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
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAnyMutationLoading = 
    deleteBookmarkMutation.isLoading || 
    duplicateBookmarkMutation.isLoading || 
    deleteBookmarkToFolderMutation.isLoading;

  const handleDuplicateBookmark = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnyMutationLoading) return;
    
    duplicateBookmarkMutation.mutate(bookmark.id);
  }, [bookmark.id, duplicateBookmarkMutation, isAnyMutationLoading]);

  const handleDeleteBookmarkToFolder = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnyMutationLoading) return;
    
    deleteBookmarkToFolderMutation.mutate({
      bookmarkId: bookmark.id,
      folderId: folderId ?? "",
    });
  }, [bookmark.id, deleteBookmarkToFolderMutation, folderId, isAnyMutationLoading]);

  const handleDeleteBookmark = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnyMutationLoading) return;
    
    if (bookmark.id) {
      deleteBookmarkMutation.mutate(bookmark.id);
    }
  }, [bookmark.id, deleteBookmarkMutation, isAnyMutationLoading]);

  const handleOpenDialog = useCallback((dialogType: string) => {
    setContentDialog(dialogType);
    setOpenDialog(true);
    setDropdownOpen(false);
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    setOpenDialog(open);
    if (!open) {
      setContentDialog("");
    }
  }, []);

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
          <DropdownMenuItem 
            onClick={() => handleOpenDialog("modif")}
            disabled={isAnyMutationLoading}
          >
            <div className="flex gap-2">
              <Pencil className="w-4 h-4" />
              Modifier
            </div>
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogTrigger asChild>
          <DropdownMenuItem 
            onClick={() => handleOpenDialog("folder")}
            disabled={isAnyMutationLoading}
          >
            <div className="flex gap-2">
              <Folder className="w-4 h-4" />
              Ajouter à un projet
            </div>
          </DropdownMenuItem>
        </DialogTrigger>
        {folderId && (
          <DropdownMenuItem 
            onClick={handleDeleteBookmarkToFolder}
            disabled={isAnyMutationLoading}
          >
            <div className="flex gap-2 items-center">
              <FolderX className="w-4 h-4" />
              Supprimer du projet
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={handleDeleteBookmark}
          disabled={isAnyMutationLoading}
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
    handleDeleteBookmark,
    handleOpenDialog,
    isAnyMutationLoading,
  ]);

  const otherUserContent = useMemo(() => {
    if (bookmark.user.id === session?.data?.user.id) {
      return null;
    }
    return (
      <DropdownMenuItem 
        onClick={handleDuplicateBookmark}
        disabled={isAnyMutationLoading}
      >
        <div className="flex gap-2">
          <Copy className="w-4 h-4" />
          Dupliquer
        </div>
      </DropdownMenuItem>
    );
  }, [bookmark.user.id, handleDuplicateBookmark, session?.data?.user.id, isAnyMutationLoading]);

  // Fermer automatiquement le dropdown quand une mutation réussit ou échoue
  useEffect(() => {
    if (
      deleteBookmarkMutation.isSuccess ||
      duplicateBookmarkMutation.isSuccess ||
      deleteBookmarkToFolderMutation.isSuccess ||
      deleteBookmarkMutation.isError ||
      duplicateBookmarkMutation.isError ||
      deleteBookmarkToFolderMutation.isError
    ) {
      setDropdownOpen(false);
    }
  }, [
    deleteBookmarkMutation.isSuccess,
    duplicateBookmarkMutation.isSuccess,
    deleteBookmarkToFolderMutation.isSuccess,
    deleteBookmarkMutation.isError,
    duplicateBookmarkMutation.isError,
    deleteBookmarkToFolderMutation.isError,
  ]);

  useEffect(() => {
    if (dropdownOpen) {
      deleteBookmarkMutation.reset();
      duplicateBookmarkMutation.reset();
      deleteBookmarkToFolderMutation.reset();
    }
  }, [dropdownOpen, deleteBookmarkMutation, duplicateBookmarkMutation, deleteBookmarkToFolderMutation]);

  return (
    <Dialog open={openDialog} onOpenChange={handleDialogChange}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
