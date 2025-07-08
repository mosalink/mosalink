import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    console.log("🔧 Correction des projets existants pour l'utilisateur:", session.user.id);

    // Récupérer tous les projets créés par cet utilisateur
    const { data: folders, error: foldersError } = await supabase
      .from('Folder')
      .select('id, name, userCreatorId')
      .eq('userCreatorId', session.user.id);

    if (foldersError) {
      console.error("Erreur récupération folders:", foldersError);
      return NextResponse.json({ error: "Erreur récupération projets" }, { status: 500 });
    }

    if (!folders || folders.length === 0) {
      return NextResponse.json({ 
        message: "Aucun projet trouvé", 
        fixed: 0,
        total: 0,
        details: "Vous n'avez créé aucun projet pour le moment."
      });
    }

    let fixedCount = 0;
    const errors: string[] = [];

    for (const folder of folders) {
      try {
        // Vérifier si le créateur est déjà dans _FolderToUser
        const { data: existingRelation } = await supabase
          .from('_FolderToUser')
          .select('*')
          .eq('A', folder.id)
          .eq('B', session.user.id)
          .single();

        if (!existingRelation) {
          // Ajouter le créateur au projet
          const { error: insertError } = await supabase
            .from('_FolderToUser')
            .insert({
              A: folder.id,
              B: session.user.id,
            });

          if (!insertError) {
            console.log(`✅ Créateur ajouté au projet: ${folder.name}`);
            fixedCount++;
          } else {
            const errorMsg = `Erreur ajout créateur au projet ${folder.name}: ${insertError.message}`;
            console.error(`❌ ${errorMsg}`);
            errors.push(errorMsg);
          }
        } else {
          console.log(`🆗 Créateur déjà membre du projet: ${folder.name}`);
        }
      } catch (error) {
        const errorMsg = `Erreur lors du traitement du projet ${folder.name}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    const response = {
      message: `Correction terminée. ${fixedCount} projet(s) corrigé(s) sur ${folders.length}`,
      fixed: fixedCount,
      total: folders.length,
      errors: errors.length > 0 ? errors : undefined,
      details: fixedCount > 0 
        ? `Vous avez été ajouté à ${fixedCount} projet(s) où vous n'étiez pas listé comme membre.`
        : "Tous vos projets sont déjà correctement configurés."
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Erreur correction projets:", error);
    return NextResponse.json({ 
      error: "Erreur interne lors de la correction des projets",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
