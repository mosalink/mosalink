import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "../../../../../../lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    // Récupérer les bookmarks de l'utilisateur avec Supabase
    const { data: bookmarks, error } = await supabaseAdmin
      .from('Bookmark')
      .select(`
        id,
        url,
        title,
        description,
        image,
        tags,
        categoryId,
        userId,
        creationDate
      `)
      .eq('userId', params.id)
      .order('creationDate', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des bookmarks:", error);
      return NextResponse.json({
        message: "Erreur lors de la récupération des bookmarks",
        status: 500,
      });
    }

    // Récupérer les catégories et utilisateurs pour les bookmarks
    const categoryIds = Array.from(new Set(bookmarks?.map(b => b.categoryId).filter(Boolean)));
    const userIds = Array.from(new Set(bookmarks?.map(b => b.userId).filter(Boolean)));

    const [categoriesResult, usersResult] = await Promise.all([
      supabaseAdmin.from('Category').select('id, name, url').in('id', categoryIds),
      supabaseAdmin.from('User').select('id, email').in('id', userIds)
    ]);

    const categories = categoriesResult.data || [];
    const users = usersResult.data || [];

    // Transformer les données pour correspondre au format attendu
    const transformedBookmarks = bookmarks?.map(bookmark => {
      const category = categories.find(c => c.id === bookmark.categoryId);
      const user = users.find(u => u.id === bookmark.userId);
      
      return {
        id: bookmark.id,
        url: bookmark.url,
        title: bookmark.title,
        description: bookmark.description,
        image: bookmark.image,
        tags: bookmark.tags,
        category: {
          name: category?.name || '',
          id: category?.id || '',
          url: category?.url || '',
        },
        user: {
          id: user?.id || '',
          email: user?.email || '',
        },
      };
    }) || [];

    return NextResponse.json(transformedBookmarks);

  } catch (error) {
    console.error("Erreur lors de la récupération des bookmarks:", error);
    return NextResponse.json({
      message: "Erreur de serveur. Veuillez réessayer plus tard.",
      status: 500,
    }, { status: 500 });
  }
}
