import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isAdminDomain } from "@/utils/roles/utils";
import { authOptions } from "../../auth/[...nextauth]/route";
import supabase from "../../../../../lib/supabase";

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

  if (!params.id) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  try {
    const { error: deleteBookmarksError } = await supabase
      .from('Bookmark')
      .delete()
      .eq('userId', params.id);

    if (deleteBookmarksError) {
      console.error('Erreur suppression bookmarks:', deleteBookmarksError);
      return NextResponse.json({ error: "Erreur lors de la suppression des bookmarks" }, { status: 500 });
    }

    const { error: deleteUserError } = await supabase
      .from('User')
      .delete()
      .eq('id', params.id);

    if (deleteUserError) {
      console.error('Erreur suppression utilisateur:', deleteUserError);
      return NextResponse.json({ error: "Erreur lors de la suppression de l'utilisateur" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
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

  if (!data.email && !data.role) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  try {
    const { data: user, error } = await supabase
      .from('User')
      .update({
        email: data.email,
        role: data.role,
        lastUpdateDate: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
