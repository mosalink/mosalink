import { routeIndexFront } from "@/utils/routes/routesFront";
import { useQuery } from "@tanstack/react-query";
import { BookmarkData } from "./useQueryBookmarksUserSupabase";

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

const fetchBookmarksFolderSupabase = async (
  id: string
): Promise<FolderBookmarsData> => {
  const response = await fetch(`${routeIndexFront}/api/bookmark/folder-supabase/${id}`);
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du folder');
  }
  
  return response.json();
};

export function useQueryBookmarksFolderSupabase(id: string) {
  const query = useQuery({
    queryKey: ["bookmarksFolderSupabase", id],
    queryFn: () => fetchBookmarksFolderSupabase(id),
    enabled: !!id, // Ne pas exécuter si id est vide
  });

  return query;
}
