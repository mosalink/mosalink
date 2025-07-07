import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";
import cuid from "cuid";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    const data = await req.json();

    if (!data.bookmarkId) {
      return NextResponse.json({
        message: "Veuillez ajouter un bookmark",
        status: 403,
      });
    }

    // Récupérer le bookmark original avec Supabase
    const { data: oldBookmark, error: fetchError } = await supabaseAdmin
      .from('Bookmark')
      .select('*')
      .eq('id', data.bookmarkId)
      .single();

    if (fetchError || !oldBookmark) {
      console.error("Erreur lors de la récupération du bookmark:", fetchError);
      return NextResponse.json({
        message: "Bookmark introuvable",
        status: 404,
      });
    }

    // Générer un nouvel ID et les dates
    const newId = cuid();
    const currentDate = new Date().toISOString();
    console.log("ID généré pour le nouveau bookmark:", newId);

    // Créer le nouveau bookmark avec Supabase
    const { data: newBookmark, error: createError } = await supabaseAdmin
      .from('Bookmark')
      .insert({
        id: newId,
        title: oldBookmark.title,
        url: oldBookmark.url,
        description: oldBookmark.description,
        tags: oldBookmark.tags,
        userId: session.user.id,
        categoryId: oldBookmark.categoryId,
        domainId: session.user.domainId,
        image: oldBookmark.image,
        creationDate: currentDate,
        lastUpdateDate: currentDate,
      })
      .select()
      .single();

    if (createError) {
      console.error("Erreur lors de la création du bookmark:", createError);
      return NextResponse.json({
        message: "Erreur lors de la duplication du bookmark",
        status: 500,
      });
    }

    return NextResponse.json(newBookmark);
  } catch (error) {
    console.error("Erreur lors de la duplication du bookmark:", error);
    return NextResponse.json({
      message: "Erreur de connexion à la base de données. Veuillez réessayer plus tard.",
      status: 500,
    }, { status: 500 });
  }
}
