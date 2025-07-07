import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { domainQueries, userQueries } from "../../../../../../../lib/supabase-queries";
import { NextResponse } from "next/server";
import { isSuperAdmin } from "@/utils/roles/utils";
import { createId } from "@paralleldrive/cuid2";

// POST - Ajouter un administrateur à un domaine
export async function POST(
  req: Request,
  { params }: { params: { domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { domainId } = params;
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Vérifier si le domaine existe
    const domain = await domainQueries.findUnique({ id: domainId });

    if (!domain) {
      return NextResponse.json(
        { error: "Domaine non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userQueries.findUnique({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Créer l'utilisateur admin
    const newAdmin = await userQueries.create({
      id: createId(),
      email,
      name: name || null,
      role: "ADMIN",
      domainId,
      creationDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    });

    return NextResponse.json({
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      creationDate: newAdmin.creationDate
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'administrateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un administrateur d'un domaine
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
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "L'ID de l'utilisateur est requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe et est admin du domaine
    const users = await userQueries.findMany({ domainId });
    const user = users.find(u => u.id === userId && u.role === "ADMIN");

    if (!user) {
      return NextResponse.json(
        { error: "Administrateur non trouvé dans ce domaine" },
        { status: 404 }
      );
    }

    // Supprimer l'utilisateur
    await userQueries.delete(userId);

    return NextResponse.json({ message: "Administrateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'administrateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
