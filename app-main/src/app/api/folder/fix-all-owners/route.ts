import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";
import { isSuperAdmin } from "@/utils/roles/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est super admin
    if (!isSuperAdmin(session.user)) {
      return NextResponse.json({ 
        error: "Accès refusé", 
        details: "Seuls les super-administrateurs peuvent effectuer cette opération."
      }, { status: 403 });
    }

    console.log("🔧 Correction globale des projets par le super admin:", session.user.id);

    // Récupérer tous les projets
    const { data: allFolders, error: foldersError } = await supabaseAdmin
      .from('Folder')
      .select('id, name, userCreatorId');

    if (foldersError) {
      console.error("Erreur récupération folders:", foldersError);
      return NextResponse.json({ error: "Erreur récupération projets" }, { status: 500 });
    }

    if (!allFolders || allFolders.length === 0) {
      return NextResponse.json({ 
        message: "Aucun projet trouvé dans le système", 
        fixed: 0,
        total: 0
      });
    }

    let fixedCount = 0;
    let alreadyFixedCount = 0;
    const errors: string[] = [];

    for (const folder of allFolders) {
      try {
        // Vérifier si le créateur est déjà dans _FolderToUser
        const { data: existingRelation } = await supabaseAdmin
          .from('_FolderToUser')
          .select('*')
          .eq('A', folder.id)
          .eq('B', folder.userCreatorId)
          .single();

        if (!existingRelation) {
          // Ajouter le créateur au projet
          const { error: insertError } = await supabaseAdmin
            .from('_FolderToUser')
            .insert({
              A: folder.id,
              B: folder.userCreatorId,
            });

          if (!insertError) {
            console.log(`✅ Créateur ajouté au projet: ${folder.name} (Créateur: ${folder.userCreatorId})`);
            fixedCount++;
          } else {
            const errorMsg = `Erreur ajout créateur au projet ${folder.name} (${folder.userCreatorId}): ${insertError.message}`;
            console.error(`❌ ${errorMsg}`);
            errors.push(errorMsg);
          }
        } else {
          console.log(`🆗 Créateur déjà membre du projet: ${folder.name}`);
          alreadyFixedCount++;
        }
      } catch (error) {
        const errorMsg = `Erreur lors du traitement du projet ${folder.name}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    const response = {
      message: `Correction globale terminée. ${fixedCount} projet(s) corrigé(s) sur ${allFolders.length}`,
      fixed: fixedCount,
      alreadyFixed: alreadyFixedCount,
      total: allFolders.length,
      errors: errors.length > 0 ? errors : undefined,
      details: {
        fixed: fixedCount > 0 
          ? `${fixedCount} créateurs ont été ajoutés à leurs projets.`
          : "Aucune correction nécessaire.",
        alreadyFixed: `${alreadyFixedCount} projets étaient déjà correctement configurés.`,
        errors: errors.length > 0 
          ? `${errors.length} erreurs rencontrées lors de la correction.`
          : "Aucune erreur rencontrée."
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Erreur correction globale projets:", error);
    return NextResponse.json({ 
      error: "Erreur interne lors de la correction globale des projets",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
