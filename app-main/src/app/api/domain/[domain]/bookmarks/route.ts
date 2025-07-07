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

    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('Bookmark')
      .select(`
        id,
        url,
        title,
        description,
        image,
        tags,
        creationDate,
        category:Category!inner(id, name, url),
        user:User!inner(id, email)
      `)
      .eq('domainId', domain.id)
      .order('creationDate', { ascending: false });

    if (bookmarksError) {
      console.error("Erreur récupération bookmarks:", bookmarksError);
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }

    return NextResponse.json(bookmarks || []);
  } catch (error) {
    console.error("Erreur récupération bookmarks:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
