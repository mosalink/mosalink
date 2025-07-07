import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Role, isAdminDomain } from "@/utils/roles/utils";
import { userQueries } from "../../../../lib/supabase-queries";
import { createId } from "@paralleldrive/cuid2";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdminDomain(session.user, session.user.domainId)) {
      return NextResponse.json({
        message: "Vous n'avez pas accès à cette page",
        status: 403,
      });
    }

    const data = await req.json();

    if (!data.email || !data.role) {
      return NextResponse.json({
        message: "Veillez remplir tous les champs",
        status: 403,
      });
    }

    const newUser = await userQueries.create({
      id: createId(),
      email: data.email,
      role: data.role ?? "USER",
      domainId: session.user.domainId,
      image: data.image,
      creationDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.domainId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const users = await userQueries.findMany({
      domainId: session.user.domainId,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
