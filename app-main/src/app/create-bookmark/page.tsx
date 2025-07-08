"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import LinkInput from "@/components/specific/Bookmark/CreateBookmark/LinkInput";
import BookmarkInput from "@/components/specific/Bookmark/CreateBookmark/BookmarkInput";

const CreateBookmark = () => {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState<null | string>(null);

  useEffect(() => {
    const url = searchParams.get("description");
    if (url) {
      setUrl(url);
    }
  }, [searchParams]);

  const stepContent = useMemo(() => {
    if (!url) {
      return <LinkInput setUrl={setUrl} />;
    }
    return <BookmarkInput url={url} setUrl={setUrl} />;
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-8 md:gap-20 py-8 md:py-40 px-4 md:px-40">
      <h1 className="text-xl md:text-2xl text-center font-bold">Insérer un lien</h1>
      {stepContent}
    </div>
  );
};

export default CreateBookmark;
