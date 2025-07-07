"use client";

import { useMemo, useState } from "react";
import LinkInput from "./LinkInput";
import BookmarkInput from "./BookmarkInput";

const CreateBookmark = () => {
  const [url, setUrl] = useState<null | string>(null);

  const stepContent = useMemo(() => {
    if (!url) {
      return <LinkInput setUrl={setUrl} />;
    }
    return <BookmarkInput url={url} setUrl={setUrl} />;
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-20 py-40 md:px-40">
      <h1 className="text-2xl text-center font-bold">Insérer un lien</h1>
      {stepContent}
    </div>
  );
};

export default CreateBookmark;
