import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { BreadcrumbItem } from "@/components/ui/breadcrumb"
import { 
  routeIndexFront, 
  routeDomainFront,
  routeCategorieFront,
  routeTagFront,
  routeFolderFront,
  routeUserFront 
} from "@/utils/routes/routesFront"

interface UseBreadcrumbsOptions {
  customItems?: BreadcrumbItem[]
  categoryName?: string
  tagName?: string
  folderName?: string
  userName?: string
  projectName?: string
}

export const useBreadcrumbs = (options: UseBreadcrumbsOptions = {}) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const {
    customItems,
    categoryName,
    tagName,
    folderName,
    userName,
    projectName
  } = options

  const breadcrumbs = useMemo(() => {
    if (customItems) {
      return customItems
    }

    const items: BreadcrumbItem[] = []
    const pathSegments = pathname.split('/').filter(Boolean)

    items.push({
      label: "",
      href: routeIndexFront || "/"
    })

    if (pathSegments.length === 0) {
      items[0].isCurrentPage = true
      return items
    }

    if (pathSegments[0] === 'super-admin') {
      items.push({
        label: "Super Admin",
        isCurrentPage: true
      })
      return items
    }

    if (pathSegments[0] === 'login') {
      items.push({
        label: "Connexion",
        isCurrentPage: true
      })
      return items
    }

    if (pathSegments[0] === 'projet') {
      items.push({
        label: "Projet",
        isCurrentPage: false
      })
      if (pathSegments[1] && projectName) {
        items.push({
          label: projectName,
          isCurrentPage: true
        })
      }
      return items
    }

    const domain = pathSegments[0]
    if (domain) {
      items.push({
        label: domain,
        href: routeDomainFront(domain)
      })

      if (pathSegments.length === 1) {
        items[items.length - 1].isCurrentPage = true
        return items
      }

      const secondSegment = pathSegments[1]

      switch (secondSegment) {
        case 'admin':
          items.push({
            label: "Administration",
            isCurrentPage: true
          })
          break

        case 'create-bookmark':
          items.push({
            label: "Créer un bookmark",
            isCurrentPage: true
          })
          break

        case 'search':
          items.push({
            label: "Recherche",
            isCurrentPage: true
          })
          break

        case 'tag':
          items.push({
            label: "Tags",
            isCurrentPage: false
          })
          if (pathSegments[2] && tagName) {
            items.push({
              label: tagName,
              isCurrentPage: true
            })
          }
          break

        case 'folder':
          items.push({
            label: "Projets",
            isCurrentPage: false
          })
          if (pathSegments[2] && folderName) {
            items.push({
              label: folderName,
              isCurrentPage: true
            })
          }
          break

        case 'user':
          items.push({
            label: "Utilisateurs",
            isCurrentPage: false
          })
          if (pathSegments[2] && userName) {
            items.push({
              label: userName,
              isCurrentPage: true
            })
          }
          break

        default:
          if (categoryName) {
            items.push({
              label: categoryName,
              isCurrentPage: true
            })
          } else {
            items.push({
              label: secondSegment,
              isCurrentPage: true
            })
          }
          break
      }
    }

    return items
  }, [pathname, customItems, categoryName, tagName, folderName, userName, projectName])

  return breadcrumbs
}
