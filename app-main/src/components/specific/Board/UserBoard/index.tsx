"use client";

import { useQueryBookmarksUserSupabase } from "@/hooks/bookmark/useQueryBookmarksUserSupabase";
import Board from "..";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import BookmarkBoard from "../BookmarkBoard";
import TitleBoard from "../TitleBoard";

interface Props {
  id: string;
  titleBoard?: string;
}

const UserBoard = ({ id }: Props) => {
  const { data: bookmarks, isLoading, isError } = useQueryBookmarksUserSupabase(id);
  const { data: session } = useSession();

  const isCurrentUser = useMemo(() => {
    if (!bookmarks?.[0]) {
      return true;
    }
    return bookmarks[0].user.email === session?.user.email;
  }, [bookmarks, session?.user.email]);

  if (isError) {
    return <p className="text-center text-red-500">Une erreur est survenue</p>;
  }

  return (
    <Board>
      <TitleBoard>
        {isCurrentUser ? "Mon tableau" : bookmarks?.[0].user.email ?? ""}
      </TitleBoard>
      <BookmarkBoard bookmarks={bookmarks ?? []} isLoading={isLoading} />
    </Board>
  );
};

export default UserBoard;
