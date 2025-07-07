import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const data = await req.json();

  if (!data.bookmarkId || !data.folderId) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const { data: existingRelation } = await supabaseAdmin
    .from('FolderBookmark')
    .select('*')
    .eq('folderId', data.folderId)
    .eq('bookmarkId', data.bookmarkId)
    .single();

  if (existingRelation) {
    return NextResponse.json({
      message: "Ce bookmark est déjà dans ce projet",
      status: 400,
    });
  }

  const { data: relation, error } = await supabaseAdmin
    .from('FolderBookmark')
    .insert({
      folderId: data.folderId,
      bookmarkId: data.bookmarkId
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(relation);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  const data = await req.json();

  if (!data.bookmarkId || !data.folderId) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const { error } = await supabaseAdmin
    .from('FolderBookmark')
    .delete()
    .eq('folderId', data.folderId)
    .eq('bookmarkId', data.bookmarkId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Bookmark supprimé du projet avec succès" });
}
