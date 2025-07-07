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
      <div className="flex gap-4 border rounded p-4 items-center h-32">
        <Skeleton className="h-24 w-32 rounded object-cover" />
        <div className="flex flex-col justify-between gap-4">
          <Skeleton className="w-96 h-4">{title}</Skeleton>
          <Skeleton className="w-96  h-3">{metaDescription}</Skeleton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 border rounded p-4 items-center h-32">
      <Image
        onErrorCapture={() => setImageError(true)}
        src={imageError ? defaultImageBookmark : image ?? ""}
        alt={title}
        width={250}
        height={150}
        unoptimized
        className="h-12 w-16 md:h-24 md:w-32 rounded object-cover"
      />

      <div className="flex flex-col justify-between gap-4">
        <p
          className="text-lg font-bold w-40 md:w-96 whitespace-nowrap text-ellipsis overflow-hidden"
          contentEditable
          onBlur={(e) => setTitle(e.target.innerText)}
        >
          {title}
        </p>
        <p
          className="text-slate-500 w-40 md:w-96 whitespace-nowrap text-ellipsis overflow-hidden"
          contentEditable
          onBlur={(e) => setMetaDescription(e.target.innerText)}
        >
          {metaDescription}
        </p>
      </div>
    </div>
  );
};

export default CardWebSite;
