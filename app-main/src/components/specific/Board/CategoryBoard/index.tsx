"use client";

import { useQueryBookmarksUser } from "@/hooks/bookmark/useQueryBookmarksUser";
import BookmarkCard from "../../Bookmark/BookmarkCard";
import Board from "..";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryBookmarksCategories } from "@/hooks/bookmark/useQueryBookmarksCategories";
import { useQueryCategoriesDomain } from "@/hooks/useCategory";
import { useMemo } from "react";
import TitleBoard from "../TitleBoard";
import BookmarkBoard from "../BookmarkBoard";

interface Props {
  id: string;
  domain: string;
}

const CategoryBoard = ({ id, domain }: Props) => {
  const {
    data: bookmarks,
    isLoading,
    isError,
    error: bookmarksError,
  } = useQueryBookmarksCategories(id);
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useQueryCategoriesDomain(domain);

  const titleContent = useMemo(() => {
    if (isLoadingCategories) {
      return <Skeleton className="h-8 w-64" />;
    }

    if (isErrorCategories) {
      console.error("Erreur lors du chargement des catégories:", categoriesError);
      return "Une erreur est survenue lors du chargement des catégories";
    }

    const category = categories?.find((category) => {
      return category.url === id;
    });

    if (!category) {
      console.warn("Catégorie non trouvée:", { id, categories });
      return "La catégorie n'existe pas";
    }

    return category?.name ?? "";
  }, [categories, id, isErrorCategories, isLoadingCategories, categoriesError]);

  if (isError) {
    console.error("Erreur lors du chargement des bookmarks:", bookmarksError);
    return <p className="text-center text-red-500">Une erreur est survenue lors du chargement des bookmarks</p>;
  }

  return (
    <Board>
      <TitleBoard className="bg-slate-100">{titleContent}</TitleBoard>
      <BookmarkBoard bookmarks={bookmarks ?? []} isLoading={isLoading} />
    </Board>
  );
};

export default CategoryBoard;
