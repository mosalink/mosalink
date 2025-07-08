import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { folderQueries } from "../../../../../../lib/supabase-queries";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { supabase } = await import("../../../../../../lib/supabase");

    const { data: folder, error: folderError } = await supabase
      .from('Folder')
      .select('*')
      .eq('id', params.id)
      .single();

    if (folderError || !folder) {
      console.error('Erreur récupération folder:', folderError);
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    const isOwner = folder.userCreatorId === session.user.id;
    
    let isMember = false;
    if (!isOwner) {
      const { data: memberRelation, error: memberError } = await supabase
        .from('_FolderToUser')
        .select('A')
        .eq('A', params.id)
        .eq('B', session.user.id)
        .single();
      
      isMember = !memberError && !!memberRelation;
    }

    if (!isOwner && !isMember) {
      return NextResponse.json({ 
        error: 'Accès refusé', 
        details: 'Vous n\'avez pas les permissions pour accéder à ce projet' 
      }, { status: 403 });
    }

    const { data: userRelations, error: userRelationError } = await supabase
      .from('_FolderToUser')
      .select('A, B')
      .eq('A', params.id);

    let memberUsers: any[] = [];
    if (!userRelationError && userRelations && userRelations.length > 0) {
      const userIds = userRelations.map(rel => rel.B);
      
      const { data: usersData, error: usersError } = await supabase
        .from('User')
        .select('id, email')
        .in('id', userIds);

      if (!usersError && usersData) {
        memberUsers = usersData;
      }
    }

    const { userQueries } = await import("../../../../../../lib/supabase-queries");
    const owner = await userQueries.findUnique({ id: folder.userCreatorId });

    const allUsers = memberUsers.slice();
    
    if (owner) {
      const ownerAlreadyInList = allUsers.find((user: any) => user.id === owner.id);
      if (!ownerAlreadyInList) {
        allUsers.unshift({
          id: owner.id,
          email: owner.email
        });
      }
    } else {
      if (session && session.user && session.user.id === folder.userCreatorId) {
        allUsers.unshift({
          id: session.user.id,
          email: session.user.email || 'Email non disponible'
        });
      }
    }

    const { data: bookmarkRelations, error: bookmarkError } = await supabase
      .from('FolderBookmark')
      .select(`
        bookmarkId,
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
      `)
      .eq('folderId', params.id);

    let bookmarks: any[] = [];
    if (!bookmarkError && bookmarkRelations) {
      bookmarks = bookmarkRelations.map((relation: any) => ({
        id: relation.Bookmark.id,
        url: relation.Bookmark.url,
        title: relation.Bookmark.title,
        description: relation.Bookmark.description,
        image: relation.Bookmark.image,
        tags: relation.Bookmark.tags || [],
        category: relation.Bookmark.Category ? {
          name: relation.Bookmark.Category.name,
          id: relation.Bookmark.Category.id,
          url: relation.Bookmark.Category.url
        } : null,
        user: {
          id: relation.Bookmark.User.id,
          email: relation.Bookmark.User.email
        }
      }));
    }

    const response = {
      id: folder.id,
      name: folder.name,
      isPublish: folder.isPublish,
      url: folder.url,
      userCreatorId: folder.userCreatorId,
      bookmarks: bookmarks,
      users: allUsers
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération du folder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du folder' },
      { status: 500 }
    );
  }
}
