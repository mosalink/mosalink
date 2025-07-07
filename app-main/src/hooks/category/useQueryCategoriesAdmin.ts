import { routeIndexFront } from "@/utils/routes/routesFront";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  url: string;
  isPublish: boolean;
  domainId: string;
  creationDate: string;
  lastUpdateDate: string;
}

const fetchCategoriesAdmin = async (): Promise<Category[]> => {
  const response = await fetch(`${routeIndexFront}/api/category`);
  return response.json();
};

export function useQueryCategoriesAdmin() {
  const query = useQuery({
    queryKey: ["categoriesAdmin"],
    queryFn: () => fetchCategoriesAdmin(),
  });

  return query;
}
