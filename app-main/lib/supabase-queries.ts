import { supabaseAdmin } from "./supabase";
import type { Database } from "./database.types";

type Tables = Database['public']['Tables'];

export const userQueries = {
  async findUnique(where: { id?: string; email?: string }) {
    const query = supabaseAdmin.from("User").select("*");
    
    if (where.id) {
      query.eq("id", where.id);
    } else if (where.email) {
      query.eq("email", where.email);
    }
    
    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error; 
    return data;
  },

  async findMany(where?: { domainId?: string }) {
    const query = supabaseAdmin.from("User").select("*");
    
    if (where?.domainId) {
      query.eq("domainId", where.domainId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async create(data: Tables['User']['Insert']) {
    const { data: newUser, error } = await supabaseAdmin
      .from("User")
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newUser;
  },

  async update(id: string, data: Tables['User']['Update']) {
    const { data: updatedUser, error } = await supabaseAdmin
      .from("User")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedUser;
  },

  async delete(id: string) {
    console.log("Début de la suppression de l'utilisateur:", id);
        
    try {
      const { error: sessionsError } = await supabaseAdmin
        .from("Session")
        .delete()
        .eq("userId", id);
      
      if (sessionsError) {
        console.error("Erreur lors de la suppression des sessions:", sessionsError);
      } else {
        console.log("Sessions supprimées");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des sessions:", error);
    }
    
    try {
      const { error: folderUserError } = await supabaseAdmin
        .from("FolderUser")
        .delete()
        .eq("userId", id);
      
      if (folderUserError) {
        console.error("Erreur lors de la suppression des relations FolderUser:", folderUserError);
      } else {
        console.log("Relations FolderUser supprimées");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des relations FolderUser:", error);
    }
    
    try {
      const { data: bookmarks } = await supabaseAdmin
        .from("Bookmark")
        .select("id")
        .eq("userId", id);
      
      if (bookmarks && bookmarks.length > 0) {
        const bookmarkIds = bookmarks.map(b => b.id);
        
        await supabaseAdmin
          .from("FolderBookmark")
          .delete()
          .in("bookmarkId", bookmarkIds);
        
        console.log("Relations FolderBookmark supprimées pour l'utilisateur");
      }
      
      const { error: bookmarksError } = await supabaseAdmin
        .from("Bookmark")
        .delete()
        .eq("userId", id);
      
      if (bookmarksError) {
        console.error("Erreur lors de la suppression des bookmarks:", bookmarksError);
      } else {
        console.log("Bookmarks supprimés");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des bookmarks:", error);
    }
    
    const { error } = await supabaseAdmin
      .from("User")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    }
    
    console.log("Utilisateur supprimé avec succès");
  },

  async findWithDomain(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("User")
      .select(`
        *,
        Domain (*)
      `)
      .eq("id", userId)
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const domainQueries = {
  async findUnique(where: { id?: string; name?: string; url?: string }) {
    const query = supabaseAdmin.from("Domain").select("*");
    
    if (where.id) {
      query.eq("id", where.id);
    } else if (where.name) {
      query.eq("name", where.name);
    } else if (where.url) {
      query.eq("url", where.url);
    }
    
    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findMany(where?: { isPublish?: boolean }) {
    const query = supabaseAdmin.from("Domain").select(`
      *,
      User!User_domainId_fkey (
        id,
        name,
        email,
        role,
        creationDate
      )
    `);
    
    if (where?.isPublish !== undefined) {
      query.eq("isPublish", where.isPublish);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async findManyWithCounts() {
    const { data: domains, error } = await supabaseAdmin
      .from("Domain")
      .select(`
        *,
        User!User_domainId_fkey (
          id,
          name,
          email,
          role,
          creationDate
        )
      `)
      .order("creationDate", { ascending: false });
    
    if (error) throw error;
    
    if (!domains) return [];
    
    const domainsWithCounts = await Promise.all(
      domains.map(async (domain) => {
        const { count: userCount, error: userCountError } = await supabaseAdmin
          .from("User")
          .select("*", { count: "exact", head: true })
          .eq("domainId", domain.id);
        
        if (userCountError) throw userCountError;
        
        const { count: categoryCount, error: categoryCountError } = await supabaseAdmin
          .from("Category")
          .select("*", { count: "exact", head: true })
          .eq("domainId", domain.id);
        
        if (categoryCountError) throw categoryCountError;
        
        const { count: bookmarkCount, error: bookmarkCountError } = await supabaseAdmin
          .from("Bookmark")
          .select("*", { count: "exact", head: true })
          .eq("domainId", domain.id);
        
        if (bookmarkCountError) throw bookmarkCountError;
        
        const adminUsers = domain.User?.filter((user: any) => user.role === "ADMIN") || [];
        
        return {
          ...domain,
          users: adminUsers,
          _count: {
            users: userCount || 0,
            categories: categoryCount || 0,
            bookmark: bookmarkCount || 0,
          }
        };
      })
    );
    
    return domainsWithCounts;
  },

  async findUniqueWithCounts(id: string) {
    try {
      const { data: domain, error } = await supabaseAdmin
        .from("Domain")
        .select(`
          *,
          User!User_domainId_fkey (
            id,
            name,
            email,
            role,
            creationDate
          )
        `)
        .eq("id", id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; 
        }
        throw error;
      }
      
      if (!domain) return null;
      
      const { count: userCount, error: userCountError } = await supabaseAdmin
        .from("User")
        .select("*", { count: "exact", head: true })
        .eq("domainId", domain.id);
      
      const { count: categoryCount, error: categoryCountError } = await supabaseAdmin
        .from("Category")
        .select("*", { count: "exact", head: true })
        .eq("domainId", domain.id);
      
      const { count: bookmarkCount, error: bookmarkCountError } = await supabaseAdmin
        .from("Bookmark")
        .select("*", { count: "exact", head: true })
        .eq("domainId", domain.id);
      
      const adminUsers = domain.User?.filter((user: any) => user.role === "ADMIN") || [];
      
      return {
        ...domain,
        users: adminUsers,
        _count: {
          users: userCount || 0,
          categories: categoryCount || 0,
          bookmark: bookmarkCount || 0,
        }
      };
    } catch (error) {
      console.error("Erreur dans findUniqueWithCounts:", error);
      return null;
    }
  },

  async create(data: Tables['Domain']['Insert']) {
    const { data: newDomain, error } = await supabaseAdmin
      .from("Domain")
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newDomain;
  },

  async update(id: string, data: Tables['Domain']['Update']) {
    const { data: updatedDomain, error } = await supabaseAdmin
      .from("Domain")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedDomain;
  },

  async delete(id: string) {
    console.log("Début de la suppression du domaine:", id);
        
    try {
      const { data: bookmarks } = await supabaseAdmin
        .from("Bookmark")
        .select("id")
        .eq("domainId", id);
      
      if (bookmarks && bookmarks.length > 0) {
        const bookmarkIds = bookmarks.map(b => b.id);
        await supabaseAdmin
          .from("FolderBookmark")
          .delete()
          .in("bookmarkId", bookmarkIds);
        console.log("Relations FolderBookmark supprimées");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des relations FolderBookmark:", error);
    }
    
    try {
      const { error: bookmarksError } = await supabaseAdmin
        .from("Bookmark")
        .delete()
        .eq("domainId", id);
      
      if (bookmarksError) throw bookmarksError;
      console.log("Bookmarks supprimés");
    } catch (error) {
      console.error("Erreur lors de la suppression des bookmarks:", error);
      throw error;
    }
    
    try {
      const { error: categoriesError } = await supabaseAdmin
        .from("Category")
        .delete()
        .eq("domainId", id);
      
      if (categoriesError) throw categoriesError;
      console.log("Catégories supprimées");
    } catch (error) {
      console.error("Erreur lors de la suppression des catégories:", error);
      throw error;
    }
    
    try {
      const { data: users } = await supabaseAdmin
        .from("User")
        .select("id")
        .eq("domainId", id);
      
      if (users && users.length > 0) {
        const userIds = users.map(u => u.id);
        await supabaseAdmin
          .from("Session")
          .delete()
          .in("userId", userIds);
        console.log("Sessions supprimées");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des sessions:", error);
    }
    
    try {
      const { data: users } = await supabaseAdmin
        .from("User")
        .select("id")
        .eq("domainId", id);
      
      if (users && users.length > 0) {
        const userIds = users.map(u => u.id);
        await supabaseAdmin
          .from("FolderUser")
          .delete()
          .in("userId", userIds);
        console.log("Relations FolderUser supprimées");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des relations FolderUser:", error);
    }
    
    try {
      const { error: usersError } = await supabaseAdmin
        .from("User")
        .delete()
        .eq("domainId", id);
      
      if (usersError) throw usersError;
      console.log("Utilisateurs supprimés");
    } catch (error) {
      console.error("Erreur lors de la suppression des utilisateurs:", error);
      throw error;
    }
    
    try {
      const { error } = await supabaseAdmin
        .from("Domain")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      console.log("Domaine supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du domaine:", error);
      throw error;
    }
  }
};

export const categoryQueries = {
  async findMany(where?: { domainId?: string; isPublish?: boolean }) {
    const query = supabaseAdmin.from("Category").select("*");
    
    if (where?.domainId) {
      query.eq("domainId", where.domainId);
    }
    if (where?.isPublish !== undefined) {
      query.eq("isPublish", where.isPublish);
    }
    
    query.order("name", { ascending: true });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async create(data: Tables['Category']['Insert']) {
    const { data: newCategory, error } = await supabaseAdmin
      .from("Category")
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newCategory;
  },

  async update(id: string, data: Tables['Category']['Update']) {
    const { data: updatedCategory, error } = await supabaseAdmin
      .from("Category")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedCategory;
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from("Category")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
};

export const bookmarkQueries = {
  async findMany(where?: { 
    domainId?: string; 
    userId?: string; 
    categoryId?: string;
    tags?: { has: string };
  }) {
    const query = supabaseAdmin.from("Bookmark").select(`
      *,
      Category (
        id,
        name,
        url
      ),
      User (
        id,
        email
      )
    `);
    
    if (where?.domainId) {
      query.eq("domainId", where.domainId);
    }
    if (where?.userId) {
      query.eq("userId", where.userId);
    }
    if (where?.categoryId) {
      query.eq("categoryId", where.categoryId);
    }
    if (where?.tags?.has) {
      query.contains("tags", [where.tags.has]);
    }
    
    query.order("creationDate", { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async findUnique(id: string) {
    const { data, error } = await supabaseAdmin
      .from("Bookmark")
      .select(`
        *,
        Category (
          id,
          name,
          url
        ),
        User (
          id,
          email
        )
      `)
      .eq("id", id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(data: Tables['Bookmark']['Insert']) {
    const { data: newBookmark, error } = await supabaseAdmin
      .from("Bookmark")
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newBookmark;
  },

  async update(id: string, data: Tables['Bookmark']['Update']) {
    const { data: updatedBookmark, error } = await supabaseAdmin
      .from("Bookmark")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return updatedBookmark;
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from("Bookmark")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  async deleteMany(where: { categoryId?: string; userId?: string }) {
    const query = supabaseAdmin.from("Bookmark").delete();
    
    if (where.categoryId) {
      query.eq("categoryId", where.categoryId);
    }
    if (where.userId) {
      query.eq("userId", where.userId);
    }
    
    const { error } = await query;
    if (error) throw error;
  }
};

// Utilitaires pour les dossiers
export const folderQueries = {
  async findMany(where?: { userId?: string }) {
    let query = supabaseAdmin.from("Folder").select(`
      *,
      FolderBookmark (
        Bookmark (
          id,
          title,
          url,
          description,
          image,
          tags,
          Category (
            id,
            name,
            url
          ),
          User (
            id,
            email
          )
        )
      ),
      FolderUser (
        User (
          id,
          email
        )
      )
    `);
    
    if (where?.userId) {
      query = supabaseAdmin.from("FolderUser").select(`
        Folder (
          *,
          FolderBookmark (
            Bookmark (
              id,
              title,
              url,
              description,
              image,
              tags,
              Category (
                id,
                name,
                url
              ),
              User (
                id,
                email
              )
            )
          )
        )
      `).eq("userId", where.userId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async findUnique(id: string) {
    const { data, error } = await supabaseAdmin
      .from("Folder")
      .select(`
        *,
        FolderBookmark (
          Bookmark (
            id,
            title,
            url,
            description,
            image,
            tags,
            Category (
              id,
              name,
              url
            ),
            User (
              id,
              email
            )
          )
        ),
        FolderUser (
          User (
            id,
            email
          )
        )
      `)
      .eq("id", id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(data: Tables['Folder']['Insert']) {
    const { data: newFolder, error } = await supabaseAdmin
      .from("Folder")
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newFolder;
  },

  async addUser(folderId: string, userId: string) {
    const { error } = await supabaseAdmin
      .from("FolderUser")
      .insert({ folderId, userId });
    
    if (error) throw error;
  },

  async removeUser(folderId: string, userId: string) {
    const { error } = await supabaseAdmin
      .from("FolderUser")
      .delete()
      .eq("folderId", folderId)
      .eq("userId", userId);
    
    if (error) throw error;
  },

  async addBookmark(folderId: string, bookmarkId: string) {
    const { error } = await supabaseAdmin
      .from("FolderBookmark")
      .insert({ folderId, bookmarkId });
    
    if (error) throw error;
  },

  async removeBookmark(folderId: string, bookmarkId: string) {
    const { error } = await supabaseAdmin
      .from("FolderBookmark")
      .delete()
      .eq("folderId", folderId)
      .eq("bookmarkId", bookmarkId);
    
    if (error) throw error;
  }
};

export const sessionQueries = {
  async create(data: Tables['Session']['Insert']) {
    const { data: newSession, error } = await supabaseAdmin
      .from("Session")
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newSession;
  },

  async delete(sessionToken: string) {
    const { error } = await supabaseAdmin
      .from("Session")
      .delete()
      .eq("sessionToken", sessionToken);
    
    if (error) throw error;
  }
};
