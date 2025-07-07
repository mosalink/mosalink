import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabase";
import { isAdminDomain } from "@/utils/roles/utils";

export async function PUT(
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

    const data = await req.json();

    if (!data.title && !data.url && !data.categoryId && !data.description) {
      return NextResponse.json({
        message: "Veillez remplir tous les champs",
        status: 403,
      });
    }

    // Récupérer les informations du bookmark avec Supabase
    const { data: bookmark, error: fetchError } = await supabaseAdmin
      .from('Bookmark')
      .select('userId, domainId')
      .eq('id', params.id)
      .single();

    if (fetchError || !bookmark) {
      console.error("Erreur lors de la récupération du bookmark:", fetchError);
      return NextResponse.json({
        message: "Bookmark introuvable",
        status: 404,
      });
    }

    // Vérifier les permissions
    if (
      bookmark &&
      (isAdminDomain(session.user, bookmark.domainId) ||
        bookmark.userId === session.user.id)
    ) {
      // Mettre à jour le bookmark avec Supabase
      const { data: updatedBookmark, error: updateError } = await supabaseAdmin
        .from('Bookmark')
        .update({
          title: data.title,
          url: data.url,
          description: data.description,
          tags: data.tags,
          categoryId: data.categoryId,
          image: data.image,
          lastUpdateDate: new Date().toISOString(),
        })
        .eq('id', params.id)
        .select()
        .single();

      if (updateError) {
        console.error("Erreur lors de la mise à jour du bookmark:", updateError);
        return NextResponse.json({
          message: "Erreur lors de la mise à jour du bookmark",
          status: 500,
        });
      }

      return NextResponse.json({
        message: "Bookmark mis à jour avec succès",
        bookmark: updatedBookmark,
      });
    }

    return NextResponse.json({
      message: "Vous n'avez pas les droits pour modifier ce bookmark",
      status: 403,
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du bookmark:", error);
    return NextResponse.json({
      message: "Erreur de serveur. Veuillez réessayer plus tard.",
      status: 500,
    }, { status: 500 });
  }
}
