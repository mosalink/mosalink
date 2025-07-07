import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { userQueries } from "../../../../../../../lib/supabase-queries";
import { NextResponse } from "next/server";
import { isSuperAdmin } from "@/utils/roles/utils";
import { createId } from "@paralleldrive/cuid2";

// GET - Récupérer tous les utilisateurs d'un domaine
export async function GET(
  req: Request,
  { params }: { params: { domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { domainId } = params;
    const users = await userQueries.findMany({ domainId });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un utilisateur dans un domaine
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
    const { email, name, role } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
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

    const newUser = await userQueries.create({
      id: createId(),
      email,
      name: name || null,
      role: role || "USER",
      domainId,
      creationDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
