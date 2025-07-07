import { NextResponse } from "next/server";
import supabase from "../../../../../../lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { domain: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { data: domain, error: domainError } = await supabase
      .from('Domain')
      .select('id')
      .eq('url', params.domain)
      .eq('isPublish', true)
      .single();

    if (domainError || !domain) {
      return NextResponse.json({ error: "Domaine non trouvé" }, { status: 404 });
    }

    const { data: categories, error: categoriesError } = await supabase
      .from('Category')
      .select('*')
      .eq('domainId', domain.id)
      .eq('isPublish', true)
      .order('name', { ascending: true });

    if (categoriesError) {
      console.error("Erreur récupération catégories:", categoriesError);
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }

    return NextResponse.json(categories || []);
  } catch (error) {
    console.error("Erreur récupération catégories:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
