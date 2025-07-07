"use client"

import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb"
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs"
import { cn } from "@/utils"

interface BreadcrumbWrapperProps {
  className?: string
  customItems?: BreadcrumbItem[]
  categoryName?: string
  tagName?: string
  folderName?: string
  userName?: string
  projectName?: string
  showHomeIcon?: boolean
}

export const BreadcrumbWrapper = ({
  className,
  customItems,
  categoryName,
  tagName,
  folderName,
  userName,
  projectName,
  showHomeIcon = true
}: BreadcrumbWrapperProps) => {
  const breadcrumbs = useBreadcrumbs({
    customItems,
    categoryName,
    tagName,
    folderName,
    userName,
    projectName
  })

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null
  }

  return (
    <div className={cn("border-b bg-muted/40 px-6 py-3", className)}>
      <div className="w-full max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbs} showHomeIcon={showHomeIcon} />
      </div>
    </div>
  )
}
