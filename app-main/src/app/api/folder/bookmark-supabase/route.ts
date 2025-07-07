import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

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

    if (!data.bookmarkId || !data.folderId) {
      return NextResponse.json({
        message: "Veillez remplir tous les champs",
        status: 403,
      });
    }

    // Vérifier que l'utilisateur a le droit d'ajouter le bookmark au folder
    const { data: folder, error: folderError } = await supabaseAdmin
      .from('Folder')
      .select('userCreatorId')
      .eq('id', data.folderId)
      .single();

    if (folderError || !folder) {
      return NextResponse.json({
        message: "Projet introuvable",
        status: 404,
      });
    }

    if (folder.userCreatorId !== session.user.id) {
      return NextResponse.json({
        message: "Vous n'avez pas les droits pour modifier ce projet",
        status: 403,
      });
    }

    // Vérifier si la relation n'existe pas déjà
    const { data: existingRelation, error: checkError } = await supabaseAdmin
      .from('_BookmarkToFolder')
      .select('*')
      .eq('A', data.bookmarkId)
      .eq('B', data.folderId)
      .single();

    if (existingRelation) {
      return NextResponse.json({
        message: "Ce bookmark est déjà dans ce projet",
        status: 400,
      });
    }

    // Ajouter la relation Bookmark-Folder
    const { data: relation, error: insertError } = await supabaseAdmin
      .from('_BookmarkToFolder')
      .insert({
        A: data.bookmarkId, // Bookmark ID
        B: data.folderId,   // Folder ID
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erreur lors de l'ajout du bookmark au projet:", insertError);
      return NextResponse.json({
        message: "Erreur lors de l'ajout du bookmark au projet",
        status: 500,
      });
    }

    return NextResponse.json({
      message: "Bookmark ajouté au projet avec succès",
      relation: relation,
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout du bookmark au projet:", error);
    return NextResponse.json({
      message: "Erreur de serveur. Veuillez réessayer plus tard.",
      status: 500,
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    const data = await req.json();

    if (!data.bookmarkId || !data.folderId) {
      return NextResponse.json({
        message: "Veillez remplir tous les champs",
        status: 403,
      });
    }

    // Vérifier que l'utilisateur a le droit de retirer le bookmark du folder
    const { data: folder, error: folderError } = await supabaseAdmin
      .from('Folder')
      .select('userCreatorId')
      .eq('id', data.folderId)
      .single();

    if (folderError || !folder) {
      return NextResponse.json({
        message: "Projet introuvable",
        status: 404,
      });
    }

    if (folder.userCreatorId !== session.user.id) {
      return NextResponse.json({
        message: "Vous n'avez pas les droits pour modifier ce projet",
        status: 403,
      });
    }

    // Supprimer la relation Bookmark-Folder
    const { error: deleteError } = await supabaseAdmin
      .from('_BookmarkToFolder')
      .delete()
      .eq('A', data.bookmarkId)
      .eq('B', data.folderId);

    if (deleteError) {
      console.error("Erreur lors du retrait du bookmark du projet:", deleteError);
      return NextResponse.json({
        message: "Erreur lors du retrait du bookmark du projet",
        status: 500,
      });
    }

    return NextResponse.json({
      message: "Bookmark retiré du projet avec succès",
    });

  } catch (error) {
    console.error("Erreur lors du retrait du bookmark du projet:", error);
    return NextResponse.json({
      message: "Erreur de serveur. Veuillez réessayer plus tard.",
      status: 500,
    }, { status: 500 });
  }
}
