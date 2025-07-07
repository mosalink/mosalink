"use client";

import Board from "..";
import { useQueryBookmarksTags } from "@/hooks/bookmark/useQueryBookmarksTags";
import TitleBoard from "../TitleBoard";
import BookmarkBoard from "../BookmarkBoard";

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
    return <p className="text-center text-red-500">Une erreur est survenue lors du chargement des bookmarks</p>;
  }

  return (
    <Board>
      <TitleBoard className="border">{id}</TitleBoard>
      <BookmarkBoard bookmarks={bookmarks ?? []} isLoading={isLoading} />
    </Board>
  );
};

export default TagBoard;
