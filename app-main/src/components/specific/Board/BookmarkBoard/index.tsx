import { Skeleton } from "@/components/ui/skeleton";
import BookmarkCard from "../../Bookmark/BookmarkCard";
import { BookmarkData } from "@/hooks/bookmark/useQueryBookmarksUserSupabase";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { routeCreateBookmarkFront } from "@/utils/routes/routesFront";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
  bookmarks: BookmarkData[];
  isLoading: boolean;
  folderId?: string;
  isPublic?: boolean;
}

const BookmarkBoard = ({ bookmarks, isLoading, folderId, isPublic }: Props) => {
  const router = useRouter();

  const { data: dataSession } = useSession();
  const domainUrl = dataSession?.user.domainUrl;

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto grid gap-x-8 gap-y-8 justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6">
        <Skeleton className="flex justify-center items-center h-80 w-full max-w-[320px]" />
        <Skeleton className="flex justify-center items-center h-80 w-full max-w-[320px]" />
      </div>
    );
  }
  if (bookmarks?.length === 0) {
    return (
      <div className="flex flex-col gap-10 justify-start items-center h-80 w-full">
        <p className="text-xl text-center">
          Pour créer une carte ici, insérez un lien
        </p>
        <Button
          className="p-2 flex gap-2 text-lg"
          onClick={() => domainUrl && router.push(routeCreateBookmarkFront(domainUrl))}
        >
          <Plus className="w-5 h-5" /> Insérer un lien
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid gap-x-20 gap-y-8 justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start px-6">
      {bookmarks?.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          folderId={folderId}
          isPublic={isPublic}
        />
      ))}
    </div>
  );
};

export default BookmarkBoard;
