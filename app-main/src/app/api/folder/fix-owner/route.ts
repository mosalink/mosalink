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
      return NextResponse.json({ message: "Aucun projet trouvé", fixed: 0 });
    }

    let fixedCount = 0;

    for (const folder of folders) {
      // Vérifier si le créateur est déjà dans FolderUser
      const { data: existingRelation } = await supabase
        .from('FolderUser')
        .select('*')
        .eq('folderId', folder.id)
        .eq('userId', session.user.id)
        .single();

      if (!existingRelation) {
        // Ajouter le créateur au projet
        const { error: insertError } = await supabase
          .from('FolderUser')
          .insert({
            folderId: folder.id,
            userId: session.user.id,
          });

        if (!insertError) {
          console.log(`✅ Créateur ajouté au projet: ${folder.name}`);
          fixedCount++;
        } else {
          console.error(`❌ Erreur ajout créateur au projet ${folder.name}:`, insertError);
        }
      } else {
        console.log(`🆗 Créateur déjà membre du projet: ${folder.name}`);
      }
    }

    return NextResponse.json({ 
      message: `Correction terminée. ${fixedCount} projet(s) corrigé(s) sur ${folders.length}`,
      fixed: fixedCount,
      total: folders.length
    });

  } catch (error) {
    console.error("Erreur correction projets:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
