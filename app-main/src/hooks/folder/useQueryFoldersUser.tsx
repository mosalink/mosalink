import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark, Folder } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface FoldersData {
  id: string;
  name: string;
  url: string;
  userCreatorId: string;
  bookmarks: Bookmark[];
}

const fetchFoldersUser = async (): Promise<FoldersData[]> => {
  const response = await fetch(`${routeIndexFront}/api/folder/`);
  return response.json();
};

export function useQueryFoldersUser() {
  const query = useQuery({
    queryKey: ["foldersUser"],
    queryFn: () => fetchFoldersUser(),
  });

  return query;
}
