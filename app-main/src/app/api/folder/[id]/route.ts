import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { isAdminDomain } from "@/utils/roles/utils";
import { supabaseAdmin } from "../../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function DELETE(
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

    // Récupérer les informations du folder avec Supabase
    const { data: folder, error: fetchError } = await supabaseAdmin
      .from('Folder')
      .select('userCreatorId')
      .eq('id', params.id)
      .single();

    if (fetchError || !folder) {
      console.error("Erreur lors de la récupération du projet:", fetchError);
      return NextResponse.json({
        message: "Projet introuvable",
        status: 404,
      });
    }

    // Vérifier que l'utilisateur est le créateur du folder
    if (folder.userCreatorId !== session.user.id) {
      return NextResponse.json({
        message: "Vous n'avez pas les droits pour supprimer ce projet",
        status: 403,
      });
    }

    // Supprimer le folder avec Supabase
    const { data: deletedFolder, error: deleteError } = await supabaseAdmin
      .from('Folder')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (deleteError) {
      console.error("Erreur lors de la suppression du projet:", deleteError);
      return NextResponse.json({
        message: "Erreur lors de la suppression du projet",
        status: 500,
      });
    }

    return NextResponse.json({
      message: "Projet supprimé avec succès",
      folder: deletedFolder,
    });

  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    return NextResponse.json({
      message: "Erreur de serveur. Veuillez réessayer plus tard.",
      status: 500,
    }, { status: 500 });
  }
}
