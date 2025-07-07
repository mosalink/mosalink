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

    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
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

    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
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
