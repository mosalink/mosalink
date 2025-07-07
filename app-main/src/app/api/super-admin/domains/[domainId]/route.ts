import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { domainQueries } from "../../../../../../lib/supabase-queries";
import { NextResponse } from "next/server";
import { isSuperAdmin } from "@/utils/roles/utils";

// PUT - Modifier un domaine
export async function PUT(
  req: Request,
  { params }: { params: { domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { domainId } = params;
    const { name, url, isPublish, maximumCategories } = await req.json();

    const updatedDomain = await domainQueries.update(domainId, {
      ...(name && { name }),
      ...(url && { url }),
      ...(typeof isPublish === 'boolean' && { isPublish }),
      ...(maximumCategories && { maximumCategories }),
      lastUpdateDate: new Date().toISOString(),
    });

    const domainWithDetails = await domainQueries.findUniqueWithCounts(domainId);

    return NextResponse.json(domainWithDetails);
  } catch (error) {
    console.error("Erreur lors de la modification du domaine:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un domaine
export async function DELETE(
  req: Request,
  { params }: { params: { domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { domainId } = params;
    console.log("Tentative de suppression du domaine:", domainId);

    // Vérifier si le domaine existe
    const domain = await domainQueries.findUniqueWithCounts(domainId);

    if (!domain) {
      console.log("Domaine non trouvé:", domainId);
      return NextResponse.json(
        { error: "Domaine non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher la suppression du domaine super-admin
    if (domain.name === "super-admin") {
      console.log("Tentative de suppression du domaine super-admin refusée");
      return NextResponse.json(
        { error: "Impossible de supprimer le domaine super-admin" },
        { status: 400 }
      );
    }

    console.log("Suppression du domaine:", domain.name);
    // Supprimer le domaine
    await domainQueries.delete(domainId);

    console.log("Domaine supprimé avec succès:", domainId);
    return NextResponse.json({ message: "Domaine supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du domaine:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
