"use client"

import { BreadcrumbWrapper } from "./BreadcrumbWrapper"
import { useQueryCategoriesDomain } from "@/hooks/useCategory"
import { useMemo } from "react"

interface CategoryBreadcrumbProps {
  domain: string
  categoryUrl: string
  className?: string
}

export const CategoryBreadcrumb = ({ domain, categoryUrl, className }: CategoryBreadcrumbProps) => {
  const { data: categories, isLoading } = useQueryCategoriesDomain(domain)
  
  const categoryName = useMemo(() => {
    if (isLoading || !categories) return undefined
    
    const category = categories.find(cat => cat.url === categoryUrl)
    return category?.name
  }, [categories, categoryUrl, isLoading])

  if (isLoading) {
    return null
  }

  return (
    <BreadcrumbWrapper
      className={className}
      categoryName={categoryName}
    />
  )
}
