import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getNameToUrl } from "@/utils/url/utils";
import { userQueries, domainQueries } from "../../../../lib/supabase-queries";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const userWithDomain = await userQueries.findWithDomain(session.user.id);
    const domain = userWithDomain?.Domain;

    return NextResponse.json(domain);
  } catch (error) {
    console.error("Erreur lors de la récupération du domaine:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const requestDomain = await request.json();

    const name: string = requestDomain.name;
    const url: string = getNameToUrl(name);

    const domain = await domainQueries.create({
      name,
      url,
    });

    return NextResponse.json({ domain });
  } catch (error) {
    console.error("Erreur lors de la création du domaine:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
