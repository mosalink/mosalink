"use client"

import { BreadcrumbWrapper } from "./BreadcrumbWrapper"

interface TagBreadcrumbProps {
  tagName: string
  className?: string
}

export const TagBreadcrumb = ({ tagName, className }: TagBreadcrumbProps) => {
  return (
    <BreadcrumbWrapper
      className={className}
      tagName={decodeURIComponent(tagName)}
    />
  )
}
