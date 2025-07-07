import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { isAdminDomain } from "@/utils/roles/utils";
import { categoryQueries } from "../../../../lib/supabase-queries";
import { createId } from "@paralleldrive/cuid2";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.domainId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const categoriesData = await categoryQueries.findMany({
      domainId: session.user.domainId,
    });

    return NextResponse.json(categoriesData);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

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

    if (!data.name || !data.url) {
      return NextResponse.json({
        message: "Veillez remplir tous les champs",
        status: 403,
      });
    }

    const newCategory = await categoryQueries.create({
      id: createId(),
      name: data.name,
      url: data.url,
      domainId: session.user.domainId,
      creationDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
