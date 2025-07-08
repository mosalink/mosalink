import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { folderQueries } from "../../../../../lib/supabase-queries";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await req.json();

    if (!data.userId || !data.folderId) {
      return NextResponse.json({
        message: "Veuillez remplir tous les champs",
        status: 403,
      });
    }

    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    const { supabase } = await import("../../../../../lib/supabase");
    const { data: folder, error: folderError } = await supabase
      .from('Folder')
      .select('userCreatorId')
      .eq('id', data.folderId)
      .single();

    if (folderError || !folder) {
      return NextResponse.json({
        message: "Projet non trouvé",
        status: 404,
      });
    }

    if (folder.userCreatorId !== session.user.id) {
      return NextResponse.json({
        message: "Seul le créateur du projet peut ajouter des membres",
        status: 403,
      });
    }

    await folderQueries.addUser(data.folderId, data.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'utilisateur au projet:", error);
    return NextResponse.json({
      message: "Erreur lors de l'ajout d'utilisateur au projet",
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await req.json();

    if (!data.userId || !data.folderId) {
      return NextResponse.json({
        message: "Veuillez remplir tous les champs",
        status: 403,
      });
    }

    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    const { supabase } = await import("../../../../../lib/supabase");
    const { data: folder, error: folderError } = await supabase
      .from('Folder')
      .select('userCreatorId')
      .eq('id', data.folderId)
      .single();

    if (folderError || !folder) {
      return NextResponse.json({
        message: "Projet non trouvé",
        status: 404,
      });
    }

    if (folder.userCreatorId !== session.user.id) {
      return NextResponse.json({
        message: "Seul le créateur du projet peut supprimer des membres",
        status: 403,
      });
    }

    if (data.userId === folder.userCreatorId) {
      return NextResponse.json({
        message: "Le créateur du projet ne peut pas être supprimé",
        status: 403,
      });
    }

    await folderQueries.removeUser(data.folderId, data.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression d'utilisateur du projet:", error);
    return NextResponse.json({
      message: "Erreur lors de la suppression d'utilisateur du projet",
      status: 500,
    });
  }
}
