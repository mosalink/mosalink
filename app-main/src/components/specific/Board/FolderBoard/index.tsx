"use client";

import { useQueryBookmarksFolderSupabase } from "@/hooks/bookmark/useQueryBookmarksFolderSupabase";
import Board from "..";
import BookmarkBoard from "../BookmarkBoard";
import TitleBoard from "../TitleBoard";
import SubtitleBoard from "../SubtitleBoard";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useMutationChangePublicFolderSupabase } from "@/hooks/folder/useMutationChangePublicFolderSupabase";
import Link from "next/link";
import {
  routeFolderFront,
  routeProjectFront,
} from "@/utils/routes/routesFront";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  isFolderPublic?: boolean;
}

const FolderBoard = ({ id, isFolderPublic }: Props) => {
  const { data: folder, isLoading, isError } = useQueryBookmarksFolderSupabase(id);
  const mutationChangePublicFolder = useMutationChangePublicFolderSupabase();

  const [isPublic, setIsPublic] = useState(false);

  // Mettre à jour le state local quand les données du folder changent
  useEffect(() => {
    if (folder?.isPublish !== undefined) {
      setIsPublic(folder.isPublish);
    }
  }, [folder?.isPublish]);

  const handleChangePublicFolder = useCallback(() => {
    const newPublicState = !isPublic;
    mutationChangePublicFolder.mutate({
      id,
      isPubish: newPublicState,
    });
    setIsPublic(newPublicState);
  }, [id, isPublic, mutationChangePublicFolder]);

  if (isError) {
    return <p className="text-center text-red-500">Une erreur est survenue</p>;
  }

  return (
    <Board>
      <div>
        <SubtitleBoard>Notre projet</SubtitleBoard>
        <TitleBoard>{folder?.name ?? ""}</TitleBoard>
        {!isFolderPublic && (
          <div className="w-full flex flex-col p-4 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Switch
                checked={isPublic}
                id="public-mode"
                onCheckedChange={() => handleChangePublicFolder()}
              />
              <Label htmlFor="public-mode">
                {isPublic ? "Rendre privé" : "Rendre public"}
              </Label>
            </div>
            {isPublic && (
              <Button variant={"link"} asChild>
                <Link href={routeProjectFront(folder?.id ?? "")}>
                  Voir le lien public
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
      <BookmarkBoard
        bookmarks={folder?.bookmarks ?? []}
        isLoading={isLoading}
        folderId={folder?.id}
        isPublic={isFolderPublic}
      />
    </Board>
  );
};

export default FolderBoard;
