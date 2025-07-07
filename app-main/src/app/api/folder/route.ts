import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabase } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { data: folders, error } = await supabase
      .from('Folder')
      .select('*')
      .eq('userCreatorId', session?.user?.id);

    if (error) {
      console.error("Erreur récupération folders:", error);
      return NextResponse.json({ error: "Erreur interne", details: error.message }, { status: 500 });
    }

    const result = Array.isArray(folders) ? folders : [];
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur récupération folders:", error);
    return NextResponse.json({ error: "Erreur interne", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Vous n'avez pas accès à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.name && !data.url) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  const normalizedUrl = data.url
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  function getRandomNumber() {
    return Math.floor(Math.random() * 1000);
  }

  async function isUrlExists(url: string) {
    const { data, error } = await supabase
      .from('Folder')
      .select('id')
      .eq('url', url)
      .single();

    return !!data && !error;
  }

  let url = normalizedUrl;
  let counter = 1;

  while (await isUrlExists(url)) {
    url = `${normalizedUrl}-${getRandomNumber()}`;
    counter += 1;

    if (counter > 10) {
      throw new Error(
        "Échec de génération d'une URL unique après 10 tentatives."
      );
    }
  }

  try {
    const newId = createId();
    console.log("ID généré pour le nouveau projet:", newId);
    
    const { data: newFolder, error } = await supabase
      .from('Folder')
      .insert({
        id: newId,
        name: data.name,
        url: url,
        userCreatorId: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur création folder:", error);
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }

    try {
      const { error: folderUserError } = await supabase
        .from('FolderUser')
        .insert({
          folderId: newId,
          userId: session.user.id,
        });

      if (folderUserError) {
        console.error("Erreur ajout créateur au projet:", folderUserError);
      } else {
        console.log("Créateur ajouté automatiquement au projet");
      }
    } catch (folderUserError) {
      console.error("Erreur ajout créateur au projet:", folderUserError);
    }

    return NextResponse.json(newFolder);
  } catch (error) {
    console.error("Erreur création folder:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
