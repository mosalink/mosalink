import { routeIndexFront } from "@/utils/routes/routesFront";
import { useQuery } from "@tanstack/react-query";
import { BookmarkData } from "./useQueryBookmarksUser";

const fetchBookmarksCategories = async (
  id: string
): Promise<BookmarkData[]> => {
  const response = await fetch(
    `${routeIndexFront}/api/bookmark/category/${id}`
  );
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

export function useQueryBookmarksCategories(id: string) {
  const query = useQuery({
    queryKey: ["bookmarksCategoryDomain", id],
    queryFn: () => fetchBookmarksCategories(id),
    enabled: !!id,
  });

  return query;
}
