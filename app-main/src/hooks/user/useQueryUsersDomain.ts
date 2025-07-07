import { routeIndexFront } from "@/utils/routes/routesFront";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  domainId: string;
}

const fetchUsersDomain = async (): Promise<User[]> => {
  const response = await fetch(routeIndexFront + "/api/user");
  
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
  
  return response.json();
};

export function useQueryUsersDomain() {
  const query = useQuery({
    queryKey: ["usersDomain"],
    queryFn: fetchUsersDomain,
  });

  return query;
}
