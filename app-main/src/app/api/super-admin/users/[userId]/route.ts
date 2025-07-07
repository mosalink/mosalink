import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { userQueries } from "../../../../../../lib/supabase-queries";
import { NextResponse } from "next/server";
import { isSuperAdmin } from "@/utils/roles/utils";

// PUT - Modifier un utilisateur
export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { userId } = params;
    const updateData = await req.json();

    // Ajouter la date de mise à jour
    const dataWithDate = {
      ...updateData,
      lastUpdateDate: new Date().toISOString(),
    };

    const updatedUser = await userQueries.update(userId, dataWithDate);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la modification de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { userId } = params;

    // Vérifier si l'utilisateur existe
    const user = await userQueries.findUnique({ id: userId });
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer l'utilisateur (et toutes ses données liées)
    await userQueries.delete(userId);

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
