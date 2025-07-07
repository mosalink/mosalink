import { routeIndexFront } from "@/utils/routes/routesFront";
import { useQuery } from "@tanstack/react-query";
import { BookmarkData } from "./useQueryBookmarksUser";

interface FolderBookmarsData {
  bookmarks: BookmarkData[];
  id: string;
  name: string;
  url: string;
  isPublish: boolean;
  userCreatorId: string;
  users: {
    id: string;
    email: string;
  }[];
}

const fetchBookmarksFolder = async (
  id: string
): Promise<FolderBookmarsData> => {
  const response = await fetch(`${routeIndexFront}/api/bookmark/folder/${id}`);
  return response.json();
};

export function useQueryBookmarksFolder(id: string) {
  const query = useQuery({
    queryKey: ["bookmarksFolderDomain", id],
    queryFn: () => fetchBookmarksFolder(id),
  });

  return query;
}
