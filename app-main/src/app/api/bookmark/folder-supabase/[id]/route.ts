import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabase } from "../../../../../../lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Récupération du folder et ses bookmarks:', params.id);
    
    // Récupérer d'abord les informations du folder
    const { data: folder, error: folderError } = await supabase
      .from('Folder')
      .select(`
        id,
        name,
        url,
        isPublish,
        userCreatorId
      `)
      .eq('id', params.id)
      .single();

    if (folderError) {
      console.error('Erreur lors de la récupération du folder:', folderError);
      return NextResponse.json({ error: 'Folder non trouvé' }, { status: 404 });
    }

    // Récupérer les bookmarks du folder via la table de liaison _BookmarkToFolder
    const { data: bookmarkRelations, error: relationError } = await supabase
      .from('_BookmarkToFolder')
      .select('A') // A = bookmarkId, B = folderId
      .eq('B', params.id);

    if (relationError) {
      console.error('Erreur lors de la récupération des relations:', relationError);
      return NextResponse.json({ error: 'Erreur lors de la récupération des relations' }, { status: 500 });
    }

    let bookmarks: any[] = [];
    
    if (bookmarkRelations && bookmarkRelations.length > 0) {
      const bookmarkIds = bookmarkRelations.map(rel => rel.A);

      // Récupérer les détails des bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('Bookmark')
        .select(`
          id,
          title,
          description,
          url,
          image,
          tags,
          category:Category(id, name, url),
          user:User(id, email)
        `)
        .in('id', bookmarkIds);

      if (bookmarksError) {
        console.error('Erreur lors de la récupération des bookmarks:', bookmarksError);
        return NextResponse.json({ error: 'Erreur lors de la récupération des bookmarks' }, { status: 500 });
      }

      // Formater les données pour correspondre à l'interface BookmarkData
      bookmarks = bookmarksData?.map((bookmark: any) => ({
        id: bookmark.id,
        url: bookmark.url,
        title: bookmark.title,
        description: bookmark.description,
        image: bookmark.image,
        tags: bookmark.tags || [],
        category: bookmark.category ? {
          name: bookmark.category.name,
          id: bookmark.category.id,
          url: bookmark.category.url
        } : {
          name: "",
          id: "",
          url: ""
        },
        user: {
          id: bookmark.user.id,
          email: bookmark.user.email
        }
      })) || [];
    }

    // Récupérer les utilisateurs associés au folder via la table de liaison _FolderToUser
    const { data: userRelations, error: userRelationError } = await supabase
      .from('_FolderToUser')
      .select('A, B') // A = folderId, B = userId
      .eq('A', params.id);

    let users: any[] = [];
    
    if (!userRelationError && userRelations && userRelations.length > 0) {
      const userIds = userRelations.map(rel => rel.B);

      const { data: usersData, error: usersError } = await supabase
        .from('User')
        .select('id, email')
        .in('id', userIds);

      if (!usersError && usersData) {
        users = usersData;
      }
    }

    // Construire la réponse complète
    const response = {
      id: folder.id,
      name: folder.name,
      url: folder.url,
      isPublish: folder.isPublish,
      userCreatorId: folder.userCreatorId,
      bookmarks,
      users
    };

    console.log(`Folder trouvé: ${folder.name}, ${bookmarks.length} bookmarks`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération du folder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du folder' },
      { status: 500 }
    );
  }
}
