"use client"

import { BreadcrumbWrapper } from "./BreadcrumbWrapper"
import { useQueryBookmarksUserSupabase } from "@/hooks/bookmark/useQueryBookmarksUserSupabase"

interface UserBreadcrumbProps {
  userId: string
  className?: string
}

export const UserBreadcrumb = ({ userId, className }: UserBreadcrumbProps) => {
  const { data: bookmarks, isLoading } = useQueryBookmarksUserSupabase(userId)

  const userName = bookmarks?.[0]?.user?.email

  if (isLoading) {
    return null
  }

  return (
    <BreadcrumbWrapper
      className={className}
      userName={userName}
    />
  )
}
