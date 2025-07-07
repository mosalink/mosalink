"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  routeCategorieFront,
  routeTagFront,
  routeUserFront,
} from "@/utils/routes/routesFront";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { BookmarkData } from "@/hooks/bookmark/useQueryBookmarksUserSupabase";
import DropdownBookmarkCard from "./DropdownBookmarkCard";
import { defaultImageBookmark } from "../../../../../constants";
import { useState } from "react";

interface Props {
  bookmark: BookmarkData;
  folderId?: string;
  isPublic?: boolean;
}

const BookmarkCard = ({ bookmark, folderId, isPublic }: Props) => {
  const router = useRouter();
  const session = useSession();

  const [imageError, setImageError] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const isDescriptionLong = bookmark.description.length > 120;

  const handleCardClick = () => {
    window.open(bookmark.url, '_blank');
  };

  const handleToggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div 
      className="group inline-flex flex-col p-4 gap-3 border rounded shadow w-[300px] min-h-[470px] hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <Image
        onErrorCapture={() => setImageError(true)}
        src={imageError ? defaultImageBookmark : bookmark.image ?? ""}
        alt={bookmark.title}
        width={250}
        height={150}
        unoptimized
        className="w-full h-[150px] rounded object-cover flex-shrink-0"
      />
      
      <div className="flex justify-between items-start gap-2 flex-shrink-0">
        <h3
          className="font-bold text-lg leading-6 w-[220px] group-hover:underline"
          style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {bookmark.title}
        </h3>
        {!isPublic && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="flex-shrink-0"
          >
            <DropdownBookmarkCard bookmark={bookmark} folderId={folderId} />
          </div>
        )}
      </div>
      
      <div className={`flex flex-col ${isDescriptionExpanded ? 'flex-auto' : 'flex-1'}`}>
        <div className="text-sm text-gray-600 leading-5">
          <p
            className={`transition-all duration-300 ${!isDescriptionExpanded ? "line-clamp-3" : ""}`}
            style={!isDescriptionExpanded ? { 
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            } : {}}
          >
            {bookmark.description}
          </p>
          
          {isDescriptionLong && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800 mt-2 transition-colors"
              onClick={handleToggleDescription}
            >
              {isDescriptionExpanded ? "Voir moins" : "Voir plus"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 mt-auto">
        <Badge
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const domainName = session.data?.user.domainName;
            if (domainName) {
              router.push(
                routeCategorieFront(
                  domainName,
                  bookmark.category.url
                )
              );
            }
          }}
        >
          {bookmark.category.name}
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap flex-shrink-0">
        {bookmark.tags?.map((tag) => (
          <Badge
            className="cursor-pointer"
            variant={"outline"}
            key={tag}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const domainName = session.data?.user.domainName;
              if (domainName) {
                router.push(routeTagFront(domainName, tag));
              }
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <p
        className="text-right text-xs text-slate-500 w-fit cursor-pointer flex-shrink-0 ml-auto"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const domainName = session.data?.user.domainName;
          if (domainName) {
            router.push(
              routeUserFront(domainName, bookmark.user.id)
            );
          }
        }}
      >
        {bookmark.user.email}
      </p>
    </div>
  );
};

export default BookmarkCard;
