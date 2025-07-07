// Types pour remplacer les types Prisma
export type Role = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  role: Role
  isBanned: boolean
  domainId: string
  creationDate: Date
  lastUpdateDate: Date
}

export interface Domain {
  id: string
  name: string
  url: string
  isPublish: boolean
  maximumCategories: number
  creationDate: Date
  lastUpdateDate: Date
}

export interface Category {
  id: string
  name: string
  url: string
  isPublish: boolean
  domainId: string
  creationDate: Date
  lastUpdateDate: Date
}

export interface Bookmark {
  id: string
  title: string
  description: string
  url: string
  tags: string[]
  image: string | null
  domainId: string
  userId: string
  categoryId: string
  creationDate: Date
  lastUpdateDate: Date
}

export interface Folder {
  id: string
  name: string
  url: string
  isPublish: boolean
  userCreatorId: string
  publicUrl: string | null
}
