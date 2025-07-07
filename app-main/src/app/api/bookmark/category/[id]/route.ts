import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "../../../../../../lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  try {
    const { data: bookmarks, error } = await supabaseAdmin
      .from('Bookmark')
      .select(`
        id,
        url,
        title,
        description,
        image,
        tags,
        category:Category!inner (
          id,
          name,
          url
        ),
        user:User!inner (
          id,
          email
        )
      `)
      .eq('category.url', params.id)
      .eq('user.domainId', session.user.domainId)
      .order('creationDate', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des bookmarks:", error);
      return NextResponse.json({
        message: "Erreur lors de la récupération des bookmarks",
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json(bookmarks || []);
  } catch (error) {
    console.error("Erreur générale:", error);
    return NextResponse.json({
      message: "Erreur interne du serveur",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }, { status: 500 });
  }
}
