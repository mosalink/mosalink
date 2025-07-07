import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BookmarkData } from "./useQueryBookmarksUser";

const fetchBookmarksDomain = async (domain: string): Promise<BookmarkData[]> => {
  const response = await fetch(`${routeIndexFront}/api/domain/${domain}/bookmarks`);
  return response.json();
};

export function useQueryBookmarksDomain(domain: string) {
  const query = useQuery({
    queryKey: ["bookmarksDomain", domain],
    queryFn: () => fetchBookmarksDomain(domain),
    enabled: !!domain,
  });

  return query;
}
