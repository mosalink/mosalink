import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark, Category } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryPostBookmark {
  title: string;
  url: string;
  tags?: string[];
  description: string;
  image?: string;
  categoryId: string;
}

interface QueryUpdateBookmark extends QueryPostBookmark {
  id: string;
}

const postBookmark = async (bookmark: QueryPostBookmark) => {
  const response = await fetch(routeIndexFront + "/api/bookmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: bookmark.title,
      url: bookmark.url,
      tags: bookmark.tags,
      description: bookmark.description,
      image: bookmark.image,
      categoryId: bookmark.categoryId,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création du bookmark');
  }

  return response.json();
};

const updateBookmark = async (bookmark: QueryUpdateBookmark) => {
  const response = await fetch(
    routeIndexFront + `/api/bookmark/${bookmark.id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        title: bookmark.title,
        url: bookmark.url,
        tags: bookmark.tags,
        description: bookmark.description,
        image: bookmark.image,
        categoryId: bookmark.categoryId,
      }),
    }
  );
};

const deleteBookmark = async (bookmarkId: string) => {
  const response = await fetch(
    routeIndexFront + `/api/bookmark/${bookmarkId}`,
    { method: "DELETE" }
  );
};

export function useMutationCreateBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPostMutation = async (bookmark: QueryPostBookmark) => {
    try {
      const response = await postBookmark(bookmark);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la création de la publication."
      );
    }
  };

  const mutation = useMutation(createPostMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le bookmark n'a pas pu être créé.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark a bien été créé.",
      });
      queryClient.refetchQueries(["bookmarksDomain"]);
    },
  });

  return mutation;
}

export function useMutationUpdateBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBookmarkMutation = async (bookmark: QueryUpdateBookmark) => {
    try {
      const response = await updateBookmark(bookmark);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la mise à jour du bookmark."
      );
    }
  };

  const mutation = useMutation(updateBookmarkMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la mise à jour du bookmark.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark a bien été mis à jour.",
      });
      queryClient.refetchQueries(["bookmarksDomain"]);
    },
  });

  return mutation;
}

export function useMutationDeleteBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPostMutation = async (bookmarkId: string) => {
    try {
      const response = await deleteBookmark(bookmarkId);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la suppression de la publication."
      );
    }
  };

  const mutation = useMutation(createPostMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression du bookmark.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark a bien été supprimé.",
      });
      queryClient.refetchQueries(["bookmarksDomain"]);
    },
  });

  return mutation;
}
