import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { defaultImageBookmark } from "../../../../../../constants";

interface Props {
  title: string;
  metaDescription: string;
  image: string | null;
  loading: boolean;
  setTitle: Dispatch<SetStateAction<string>>;
  setMetaDescription: Dispatch<SetStateAction<string>>;
}

const CardWebSite = ({
  title,
  metaDescription,
  image,
  loading,
  setTitle,
  setMetaDescription,
}: Props) => {
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div className="flex gap-4 border rounded p-4 items-start min-h-32">
        <Skeleton className="h-12 w-16 md:h-24 md:w-32 rounded object-cover flex-shrink-0" />
        <div className="flex flex-col gap-3 w-40 md:w-96">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 border rounded p-4 items-start min-h-32">
      <Image
        onErrorCapture={() => setImageError(true)}
        src={imageError ? defaultImageBookmark : image ?? ""}
        alt={title}
        width={250}
        height={150}
        unoptimized
        className="h-12 w-16 md:h-24 md:w-32 rounded object-cover flex-shrink-0"
      />

      <div className="flex flex-col gap-3 w-40 md:w-96">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Titre
          </label>
          <p
            className="text-lg font-bold leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 py-1 min-h-[2rem] break-words"
            contentEditable
            onBlur={(e) => setTitle(e.target.innerText)}
            suppressContentEditableWarning={true}
          >
            {title}
          </p>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Description
          </label>
          <p
            className="text-slate-500 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 py-1 min-h-[3rem] break-words"
            contentEditable
            onBlur={(e) => setMetaDescription(e.target.innerText)}
            suppressContentEditableWarning={true}
          >
            {metaDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardWebSite;
