"use client"

import { BreadcrumbWrapper } from "./BreadcrumbWrapper"
import { useQueryBookmarksFolderSupabase } from "@/hooks/bookmark/useQueryBookmarksFolderSupabase"

interface FolderBreadcrumbProps {
  folderId: string
  className?: string
}

export const FolderBreadcrumb = ({ folderId, className }: FolderBreadcrumbProps) => {
  const { data: folder, isLoading } = useQueryBookmarksFolderSupabase(folderId)

  if (isLoading) {
    return null
  }

  return (
    <BreadcrumbWrapper
      className={className}
      folderName={folder?.name}
    />
  )
}
