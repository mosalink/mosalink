import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CardWebSite from "../CreateBookmark/CardWebSite";
import CategoriesSelect from "../CreateBookmark/BookmarkInput/CategoriesSelect";
import TagsInput from "../CreateBookmark/BookmarkInput/TagsInput";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutationUpdateBookmarkSupabase } from "@/hooks/bookmark/useMutationUpdateBookmarkSupabase";
import { BookmarkData } from "@/hooks/bookmark/useQueryBookmarksUserSupabase";

interface Props {
  bookmark: BookmarkData;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const BookmarkModif = ({ bookmark, setOpenDialog }: Props) => {
  const mutation = useMutationUpdateBookmarkSupabase();

  const [tags, setTags] = useState<string[]>(bookmark.tags);
  const [categoryId, setCategoryId] = useState<string | undefined>(
    bookmark.category.id
  );
  const [metaDescription, setMetaDescription] = useState<string>(
    bookmark.description
  );
  const [title, setTitle] = useState<string>(bookmark.title);
  const [image, setImage] = useState<string>(bookmark.image ?? "");

  const handleModifyBookmark = useCallback(() => {
    mutation.mutate({
      id: bookmark.id,
      title,
      url: bookmark.url,
      tags,
      description: metaDescription,
      image,
      categoryId: categoryId ?? "",
    });

    setOpenDialog(false);
  }, [
    bookmark.id,
    bookmark.url,
    categoryId,
    image,
    metaDescription,
    mutation,
    tags,
    title,
    setOpenDialog,
  ]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Le Bookmark</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <div className="w-full flex flex-col gap-4 py-4">
          <CardWebSite
            title={bookmark.title}
            metaDescription={bookmark.description}
            image={bookmark.image ?? ""}
            loading={false}
            setTitle={setTitle}
            setMetaDescription={setMetaDescription}
          />
          <CategoriesSelect
            setCategoryId={setCategoryId}
            categoryId={categoryId}
          />
          <TagsInput tags={tags} setTags={setTags} />
        </div>
        <DialogFooter>
          <Button
            onClick={(e) => {
              handleModifyBookmark();
            }}
          >
            Modifier
          </Button>
        </DialogFooter>
      </DialogDescription>
    </>
  );
};

export default BookmarkModif;
