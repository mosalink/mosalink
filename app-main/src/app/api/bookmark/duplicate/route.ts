import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    const data = await req.json();

    if (!data.bookmarkId) {
      return NextResponse.json({
        message: "Veillez ajouter un bookmark",
        status: 403,
      });
    }

    const { data: oldBookmark, error: fetchError } = await supabaseAdmin
      .from('Bookmark')
      .select('*')
      .eq('id', data.bookmarkId)
      .single();

    if (fetchError || !oldBookmark) {
      return NextResponse.json({
        message: "Bookmark introuvable",
        status: 404,
      });
    }

    const { data: newBookmark, error: createError } = await supabaseAdmin
      .from('Bookmark')
      .insert({
        title: oldBookmark.title,
        url: oldBookmark.url,
        description: oldBookmark.description,
        tags: oldBookmark.tags,
        userId: session.user.id,
        categoryId: oldBookmark.categoryId,
        domainId: session.user.domainId,
        image: oldBookmark.image,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({
        message: "Erreur lors de la duplication du bookmark",
        status: 500,
      });
    }

    return NextResponse.json(newBookmark);
  } catch (error) {
    console.error("Erreur lors de la duplication du bookmark:", error);
    return NextResponse.json(
      {
        message:
          "Erreur de connexion à la base de données. Veuillez réessayer plus tard.",
        status: 500,
      },
      { status: 500 }
    );
  }
}
