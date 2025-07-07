import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isAdminDomain } from "@/utils/roles/utils";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { categoryQueries } from "../../../../../../lib/supabase-queries";
import { supabase } from "../../../../../../lib/supabase";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdminDomain(session.user, session.user.domainId)) {
      return NextResponse.json({
        message: "Vous n'avez pas accès à cette page",
        status: 403,
      });
    }

    // Vérifier que la catégorie existe et appartient au bon domaine
    const { data: category, error: categoryError } = await supabase
      .from('Category')
      .select('id, domainId')
      .eq('id', params.id)
      .eq('domainId', session.user.domainId)
      .single();

    if (categoryError || !category) {
      return NextResponse.json({
        message: "Catégorie non trouvée",
        status: 404,
      });
    }

    // Supprimer d'abord tous les bookmarks associés à cette catégorie
    const { error: deleteBookmarksError } = await supabase
      .from('Bookmark')
      .delete()
      .eq('categoryId', params.id);

    if (deleteBookmarksError) {
      console.error('Erreur lors de la suppression des bookmarks:', deleteBookmarksError);
      return NextResponse.json({
        message: "Erreur lors de la suppression des bookmarks associés",
        status: 500,
      });
    }

    // Supprimer la catégorie
    const { error: deleteCategoryError } = await supabase
      .from('Category')
      .delete()
      .eq('id', params.id);

    if (deleteCategoryError) {
      console.error('Erreur lors de la suppression de la catégorie:', deleteCategoryError);
      return NextResponse.json({
        message: "Erreur lors de la suppression de la catégorie",
        status: 500,
      });
    }

    return NextResponse.json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !isAdminDomain(session.user, session.user.domainId)) {
      return NextResponse.json({
        message: "Vous devez être connecté pour accéder à cette page",
        status: 403,
      });
    }

    const data = await req.json();

    if (!data.name || !data.url) {
      return NextResponse.json({
        message: "Veuillez remplir tous les champs",
        status: 400,
      });
    }

    // Vérifier que la catégorie existe et appartient au bon domaine
    const { data: existingCategory, error: existingCategoryError } = await supabase
      .from('Category')
      .select('id, domainId')
      .eq('id', params.id)
      .eq('domainId', session.user.domainId)
      .single();

    if (existingCategoryError || !existingCategory) {
      return NextResponse.json({
        message: "Catégorie non trouvée",
        status: 404,
      });
    }

    // Mettre à jour la catégorie
    const { data: updatedCategory, error } = await supabase
      .from('Category')
      .update({
        name: data.name,
        url: data.url,
        lastUpdateDate: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      return NextResponse.json({
        message: "Erreur lors de la mise à jour de la catégorie",
        status: 500,
      });
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
