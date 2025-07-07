import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    const data = await req.json();

    if (typeof data.isPublish !== 'boolean' || !data.id) {
      return NextResponse.json({
        message: "Veuillez remplir tous les champs",
        status: 403,
      });
    }

    // Vérifier que l'utilisateur est le propriétaire du folder
    const { data: folder, error: folderError } = await supabase
      .from('Folder')
      .select('userCreatorId')
      .eq('id', data.id)
      .single();

    if (folderError || !folder) {
      console.error('Erreur lors de la récupération du folder:', folderError);
      return NextResponse.json({
        message: "Folder non trouvé",
        status: 404,
      });
    }

    if (folder.userCreatorId !== session.user.id) {
      return NextResponse.json({
        message: "Vous n'avez pas l'autorisation de modifier ce folder",
        status: 403,
      });
    }

    // Mettre à jour le statut public/privé
    const { data: updatedFolder, error } = await supabase
      .from('Folder')
      .update({
        isPublish: data.isPublish,
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du folder:', error);
      return NextResponse.json({
        message: "Erreur lors de la mise à jour du folder",
        status: 500,
      });
    }

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du folder:', error);
    return NextResponse.json({
      message: "Erreur interne du serveur",
      status: 500,
    });
  }
}
