"use client";

import Board from "..";
import { useQueryBookmarksTags } from "@/hooks/bookmark/useQueryBookmarksTags";
import BookmarkBoard from "../BookmarkBoard";
import BoardHeader from "../BoardHeader";

interface Props {
  id: string;
}

const TagBoard = ({ id }: Props) => {
  const { 
    data: bookmarks, 
    isLoading, 
    isError, 
    error 
  } = useQueryBookmarksTags(id);

  if (isError) {
    console.error("Erreur lors du chargement des bookmarks par tag:", error);
    return (
      <Board>
        <BoardHeader title="Erreur" titleClassName="border" />
        <p className="text-center text-red-500">Une erreur est survenue lors du chargement des bookmarks</p>
      </Board>
    );
  }

  return (
    <Board>
      <BoardHeader title={id} titleClassName="border" />
      <BookmarkBoard bookmarks={bookmarks ?? []} isLoading={isLoading} />
    </Board>
  );
};

export default TagBoard;
