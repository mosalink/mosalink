import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabaseAdmin } from "../../../../../lib/supabase";
import { NextResponse } from "next/server";
import { Role } from "../../../../../lib/types";
import { isAdminDomain } from "@/utils/roles/utils";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data: bookmark, error } = await supabaseAdmin
    .from('Bookmark')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(bookmark);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const { data: bookmark, error: fetchError } = await supabaseAdmin
    .from('Bookmark')
    .select('userId, domainId')
    .eq('id', params.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (
    bookmark &&
    (isAdminDomain(session.user, bookmark.domainId) ||
      bookmark.userId === session.user.id)
  ) {
    const { data: deletedBookmark, error: deleteError } = await supabaseAdmin
      .from('Bookmark')
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(deletedBookmark);
  }

  return NextResponse.json({
    message: "Vous n'avez pas les droits pour supprimer ce bookmark",
    status: 403,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.title && !data.url && !data.categoryId && !data.description) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  const { data: bookmark, error: fetchError } = await supabaseAdmin
    .from('Bookmark')
    .select('userId, domainId')
    .eq('id', params.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (
    bookmark &&
    (isAdminDomain(session.user, bookmark.domainId) ||
      bookmark.userId === session.user.id)
  ) {
    const { data: updatedBookmark, error: updateError } = await supabaseAdmin
      .from('Bookmark')
      .update({
        title: data.title,
        url: data.url,
        description: data.description,
        tags: data.tags,
        categoryId: data.categoryId,
        image: data.image,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedBookmark);
  }

  return NextResponse.json({
    message: "Vous n'avez pas les droits pour modifier ce bookmark",
    status: 403,
  });
}
