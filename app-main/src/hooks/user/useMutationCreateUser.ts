import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark, Category, Role } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryCreateUser {
  email: string;
  role: Role;
}

const createUser = async (user: QueryCreateUser) => {
  const response = await fetch(routeIndexFront + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      role: user.role,
    }),
  });
};

export function useMutationCreateUser() {
  const queryClient = useQueryClient();

  const createPostMutation = async (user: QueryCreateUser) => {
    try {
      const response = await createUser(user);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la création de l'utilisateur."
      );
    }
  };

  const mutation = useMutation(createPostMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(["usersDomain"]);
    },
  });

  return mutation;
}
