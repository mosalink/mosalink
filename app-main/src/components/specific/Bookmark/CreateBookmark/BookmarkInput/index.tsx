"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import CardWebSite from "../CardWebSite";
import { routeDomainFront } from "@/utils/routes/routesFront";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CategoriesSelect from "./CategoriesSelect";
import TagsInput from "./TagsInput";
import { useMutationCreateBookmarkSupabase } from "@/hooks/bookmark/useMutationCreateBookmarkSupabase";

interface Props {
  url: string;
  setUrl: Dispatch<SetStateAction<string | null>>;
}

const BookmarkInput = ({ url, setUrl }: Props) => {
  const [metaDescription, setMetaDescription] = useState<string>(
    "La description du bookmark"
  );
  const [title, setTitle] = useState<string>(url);
  const [image, setImage] = useState<string>(url);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [categoryMessage, setCategoryMessage] = useState<string | null>(null);

  const mutation = useMutationCreateBookmarkSupabase();

  const router = useRouter();
  const session = useSession();

  const getHtmlToUrl = useCallback(async (url: string) => {
    try {
      const response = await fetch("/api/get-data-url", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
      const {
        title,
        metaDescription,
        image,
      }: {
        title: string | undefined;
        metaDescription: string | undefined;
        image: string | undefined;
      } = await response.json();

      title && setTitle(title);
      metaDescription && setMetaDescription(metaDescription);
      image && setImage(image);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getHtmlToUrl(url);
  }, [getHtmlToUrl, url]);

  const handleCreateBookmark = useCallback(() => {
    if (!categoryId) {
      return setCategoryMessage("Veuillez sélectionner une Catégorie");
    }

    if (title && url && tags && image) {
      setCategoryMessage(null);
      mutation.mutate({
        title,
        url,
        tags,
        description: metaDescription ?? "",
        image,
        categoryId,
      });
    }
  }, [categoryId, image, metaDescription, mutation, tags, title, url]);

  if (mutation.isSuccess) {
    const domainName = session.data?.user.domainName;
    if (domainName) {
      router.push(routeDomainFront(domainName));
    }
  }

  return (
    <div className="flex flex-col gap-4 items-start">
      <Button variant="secondary" size={"sm"} onClick={() => setUrl(null)}>
        Annuler
      </Button>
      <CardWebSite
        title={title ?? url}
        metaDescription={metaDescription}
        image={image}
        loading={loading}
        setTitle={setTitle}
        setMetaDescription={setMetaDescription}
      />

      <CategoriesSelect setCategoryId={setCategoryId} />
      {categoryMessage && !categoryId && (
        <p className="text-sm text-red-500">{categoryMessage}</p>
      )}
      <TagsInput tags={tags} setTags={setTags} />
      <Button onClick={() => handleCreateBookmark()}>Créer</Button>
    </div>
  );
};

export default BookmarkInput;
