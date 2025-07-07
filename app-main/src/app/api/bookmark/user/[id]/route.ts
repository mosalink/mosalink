import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "../../../../../../lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data: bookmarks, error } = await supabaseAdmin
    .from('Bookmark')
    .select(`
      id,
      url,
      title,
      description,
      image,
      tags,
      category:Category(name, id, url),
      user:User(id, email)
    `)
    .eq('userId', params.id)
    .order('creationDate', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(bookmarks);
}
