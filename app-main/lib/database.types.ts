export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Account: {
        Row: {
          id: string
          userId: string
          type: string
          provider: string
          providerAccountId: string
          refresh_token: string | null
          access_token: string | null
          expires_at: number | null
          token_type: string | null
          scope: string | null
          id_token: string | null
          session_state: string | null
        }
        Insert: {
          id?: string
          userId: string
          type: string
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
        }
        Update: {
          id?: string
          userId?: string
          type?: string
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
        }
      }
      Session: {
        Row: {
          id: string
          sessionToken: string
          userId: string
          expires: string
        }
        Insert: {
          id?: string
          sessionToken: string
          userId: string
          expires: string
        }
        Update: {
          id?: string
          sessionToken?: string
          userId?: string
          expires?: string
        }
      }
      VerificationToken: {
        Row: {
          identifier: string
          token: string
          expires: string
        }
        Insert: {
          identifier: string
          token: string
          expires: string
        }
        Update: {
          identifier?: string
          token?: string
          expires?: string
        }
      }
      Domain: {
        Row: {
          id: string
          name: string
          url: string
          isPublish: boolean
          maximumCategories: number
          creationDate: string
          lastUpdateDate: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          isPublish?: boolean
          maximumCategories?: number
          creationDate?: string
          lastUpdateDate?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          isPublish?: boolean
          maximumCategories?: number
          creationDate?: string
          lastUpdateDate?: string
        }
      }
      User: {
        Row: {
          id: string
          name: string | null
          email: string | null
          emailVerified: string | null
          image: string | null
          role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
          isBanned: boolean
          domainId: string
          creationDate: string
          lastUpdateDate: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          emailVerified?: string | null
          image?: string | null
          role?: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
          isBanned?: boolean
          domainId?: string
          creationDate?: string
          lastUpdateDate?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          emailVerified?: string | null
          image?: string | null
          role?: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
          isBanned?: boolean
          domainId?: string
          creationDate?: string
          lastUpdateDate?: string
        }
      }
      Category: {
        Row: {
          id: string
          name: string
          url: string
          isPublish: boolean
          domainId: string
          creationDate: string
          lastUpdateDate: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          isPublish?: boolean
          domainId: string
          creationDate?: string
          lastUpdateDate?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          isPublish?: boolean
          domainId?: string
          creationDate?: string
          lastUpdateDate?: string
        }
      }
      Bookmark: {
        Row: {
          id: string
          title: string
          description: string
          url: string
          tags: string[]
          image: string | null
          domainId: string
          userId: string
          categoryId: string
          creationDate: string
          lastUpdateDate: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          url: string
          tags?: string[]
          image?: string | null
          domainId: string
          userId: string
          categoryId: string
          creationDate?: string
          lastUpdateDate?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          url?: string
          tags?: string[]
          image?: string | null
          domainId?: string
          userId?: string
          categoryId?: string
          creationDate?: string
          lastUpdateDate?: string
        }
      }
      Folder: {
        Row: {
          id: string
          name: string
          url: string
          isPublish: boolean
          publicUrl: string | null
          userCreatorId: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          isPublish?: boolean
          publicUrl?: string | null
          userCreatorId: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          isPublish?: boolean
          publicUrl?: string | null
          userCreatorId?: string
        }
      }
      // Tables de liaison many-to-many
      FolderUser: {
        Row: {
          folderId: string
          userId: string
        }
        Insert: {
          folderId: string
          userId: string
        }
        Update: {
          folderId?: string
          userId?: string
        }
      }
      FolderBookmark: {
        Row: {
          folderId: string
          bookmarkId: string
        }
        Insert: {
          folderId: string
          bookmarkId: string
        }
        Update: {
          folderId?: string
          bookmarkId?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
