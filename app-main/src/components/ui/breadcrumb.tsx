"use client"

import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHomeIcon?: boolean
}

const Breadcrumb = React.forwardRef<
  HTMLElement,
  BreadcrumbProps
>(({ items, className, showHomeIcon = true, ...props }, ref) => {
  if (!items || items.length === 0) return null

  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
            )}
            {item.href && !item.isCurrentPage ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors duration-200 hover:underline flex items-center gap-1"
              >
                {index === 0 && showHomeIcon && (
                  <Home className="h-4 w-4" />
                )}
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "flex items-center gap-1",
                  item.isCurrentPage && "text-foreground font-medium"
                )}
              >
                {index === 0 && showHomeIcon && (
                  <Home className="h-4 w-4" />
                )}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
})

Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }
