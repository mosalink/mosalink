import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { bookmarkQueries } from "../../../../lib/supabase-queries";
import { createId } from "@paralleldrive/cuid2";

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

    if (!data.title || !data.url || !data.description) {
      return NextResponse.json({
        message: "Veillez remplir tous les champs",
        status: 403,
      });
    }

    const bookmark = await bookmarkQueries.create({
      id: createId(),
      title: data.title,
      url: data.url,
      description: data.description,
      tags: data.tags || [],
      userId: session.user.id,
      categoryId: data.categoryId,
      domainId: session.user.domainId,
      image: data.image,
      creationDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Erreur lors de la création du bookmark:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    const bookmarks = await bookmarkQueries.findMany({
      domainId: session.user.domainId,
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Erreur lors de la récupération des bookmarks:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
