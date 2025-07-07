"use client"

import { usePathname } from "next/navigation"
import { BreadcrumbWrapper } from "./BreadcrumbWrapper"
import { CategoryBreadcrumb } from "./CategoryBreadcrumb"
import { FolderBreadcrumb } from "./FolderBreadcrumb"
import { UserBreadcrumb } from "./UserBreadcrumb"
import { TagBreadcrumb } from "./TagBreadcrumb"

interface DynamicBreadcrumbProps {
  domain?: string
  className?: string
}

export const DynamicBreadcrumb = ({ domain, className }: DynamicBreadcrumbProps) => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  // Si nous sommes sur la page d'accueil du domaine, on affiche un breadcrumb simple
  if (pathSegments.length === 1) {
    return (
      <BreadcrumbWrapper 
        className={className}
        customItems={[
          { label: "Accueil", href: "/" },
          { label: pathSegments[0], isCurrentPage: true }
        ]}
      />
    )
  }

  // Si nous n'avons pas assez d'informations
  if (pathSegments.length === 0) {
    return null
  }

  const domainSegment = pathSegments[0]
  const secondSegment = pathSegments[1]
  const thirdSegment = pathSegments[2]

  // Routes spécialisées
  switch (secondSegment) {
    case 'tag':
      if (thirdSegment) {
        return <TagBreadcrumb tagName={thirdSegment} className={className} />
      }
      break

    case 'folder':
      if (thirdSegment) {
        return <FolderBreadcrumb folderId={thirdSegment} className={className} />
      }
      break

    case 'user':
      if (thirdSegment) {
        return <UserBreadcrumb userId={thirdSegment} className={className} />
      }
      break

    case 'admin':
      return (
        <BreadcrumbWrapper 
          className={className}
          customItems={[
            { label: "Accueil", href: "/" },
            { label: domainSegment, href: `/${domainSegment}` },
            { label: "Administration", isCurrentPage: true }
          ]}
        />
      )

    case 'create-bookmark':
      return (
        <BreadcrumbWrapper 
          className={className}
          customItems={[
            { label: "Accueil", href: "/" },
            { label: domainSegment, href: `/${domainSegment}` },
            { label: "Créer un bookmark", isCurrentPage: true }
          ]}
        />
      )

    case 'search':
      return (
        <BreadcrumbWrapper 
          className={className}
          customItems={[
            { label: "Accueil", href: "/" },
            { label: domainSegment, href: `/${domainSegment}` },
            { label: "Recherche", isCurrentPage: true }
          ]}
        />
      )

    default:
      // Probablement une catégorie
      if (domain) {
        return <CategoryBreadcrumb domain={domain} categoryUrl={secondSegment} className={className} />
      }
      break
  }

  // Fallback pour le breadcrumb générique
  return <BreadcrumbWrapper className={className} />
}
