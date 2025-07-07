import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isAdminDomain } from "@/utils/roles/utils";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminDomain(session.user, session.user.domainId)) {
    return NextResponse.json({
      message: "Vous n'avez pas accès à cette page",
      status: 403,
    });
  }

  const { error: deleteBookmarksError } = await supabaseAdmin
    .from('Bookmark')
    .delete()
    .eq('categoryId', params.id);

  if (deleteBookmarksError) {
    return NextResponse.json({ error: deleteBookmarksError.message }, { status: 500 });
  }

  const { data: deletedCategory, error: deleteCategoryError } = await supabaseAdmin
    .from('Category')
    .delete()
    .eq('id', params.id)
    .select()
    .single();

  if (deleteCategoryError) {
    return NextResponse.json({ error: deleteCategoryError.message }, { status: 500 });
  }

  return NextResponse.json({ deletedCategory });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminDomain(session.user, session.user.domainId)) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.name && !data.url) {
    return NextResponse.error;
  }

  const { data: category, error } = await supabaseAdmin
    .from('Category')
    .update({
      name: data.name,
      url: data.url,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(category);

  return NextResponse.json(category);
}
