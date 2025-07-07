import { routeIndexFront } from "@/utils/routes/routesFront";
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

const fetchBookmarksUserSupabase = async (id: string): Promise<BookmarkData[]> => {
  const response = await fetch(`${routeIndexFront}/api/bookmark/user-supabase/${id}`);
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des bookmarks');
  }
  
  return response.json();
};

export function useQueryBookmarksUserSupabase(id: string) {
  const query = useQuery({
    queryKey: ["bookmarksUserSupabase", id],
    queryFn: () => fetchBookmarksUserSupabase(id),
    enabled: !!id, // Ne pas exécuter si id est vide
  });

  return query;
}
