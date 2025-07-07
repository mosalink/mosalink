import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export interface BookmarkData {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: {
    name: string;
    id: string;
    url: string;
  };
  user: {
    id: string;
    email: string;
  };
}

const fetchBookmarksUser = async (id: string): Promise<BookmarkData[]> => {
  const response = await fetch(`${routeIndexFront}/api/bookmark/user/${id}`);
  return response.json();
};

export function useQueryBookmarksUser(id: string) {
  const query = useQuery({
    queryKey: ["bookmarksUserDomain"],
    queryFn: () => fetchBookmarksUser(id),
  });

  return query;
}
