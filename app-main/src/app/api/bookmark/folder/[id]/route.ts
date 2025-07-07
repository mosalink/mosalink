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

    const folder = await folderQueries.findUnique(params.id);

    if (!folder) {
      return NextResponse.json({ error: 'Folder non trouvé' }, { status: 404 });
    }

    const memberUsers = folder.FolderUser?.map((fu: any) => ({
      id: fu.User.id,
      email: fu.User.email
    })) || [];

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

    const response = {
      id: folder.id,
      name: folder.name,
      isPublish: folder.isPublish,
      url: folder.url,
      userCreatorId: folder.userCreatorId,
      bookmarks: folder.FolderBookmark?.map((fb: any) => ({
        id: fb.Bookmark.id,
        url: fb.Bookmark.url,
        title: fb.Bookmark.title,
        description: fb.Bookmark.description,
        image: fb.Bookmark.image,
        tags: fb.Bookmark.tags || [],
        category: fb.Bookmark.Category ? {
          name: fb.Bookmark.Category.name,
          id: fb.Bookmark.Category.id,
          url: fb.Bookmark.Category.url
        } : null,
        user: {
          id: fb.Bookmark.User.id,
          email: fb.Bookmark.User.email
        }
      })) || [],
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
