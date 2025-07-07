import { routeIndexFront } from "@/utils/routes/routesFront";
import { useQuery } from "@tanstack/react-query";
import { BookmarkData } from "./useQueryBookmarksUser";

const fetchBookmarksTags = async (name: string): Promise<BookmarkData[]> => {
  const response = await fetch(`${routeIndexFront}/api/bookmark/tag/${name}`);
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

export function useQueryBookmarksTags(name: string) {
  const query = useQuery({
    queryKey: ["bookmarksTagsDomain", name],
    queryFn: () => fetchBookmarksTags(name),
    enabled: !!name,
  });

  return query;
}
