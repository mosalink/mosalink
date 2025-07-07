import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { domainQueries, userQueries } from "../../../../../lib/supabase-queries";
import { NextResponse } from "next/server";
import { isSuperAdmin } from "@/utils/roles/utils";
import { createId } from "@paralleldrive/cuid2";

// GET - Récupérer tous les domaines avec leurs administrateurs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const domains = await domainQueries.findManyWithCounts();

    return NextResponse.json(domains);
  } catch (error) {
    console.error("Erreur lors de la récupération des domaines:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau domaine
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { name, url, isPublish, maximumCategories, adminEmail } = await req.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Le nom et l'URL du domaine sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si le domaine existe déjà
    const existingDomainByName = await domainQueries.findUnique({ name });
    const existingDomainByUrl = await domainQueries.findUnique({ url });

    if (existingDomainByName || existingDomainByUrl) {
      return NextResponse.json(
        { error: "Un domaine avec ce nom ou cette URL existe déjà" },
        { status: 409 }
      );
    }

    // Créer le domaine
    const newDomain = await domainQueries.create({
      id: createId(),
      name,
      url,
      isPublish: isPublish || false,
      maximumCategories: maximumCategories || 10,
      creationDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
    });
    
    console.log("Domaine créé:", newDomain);

    // Si un email d'admin est fourni, créer l'utilisateur admin
    if (adminEmail) {
      try {
        await userQueries.create({
          id: createId(),
          email: adminEmail,
          role: "ADMIN",
          domainId: newDomain.id,
          creationDate: new Date().toISOString(),
          lastUpdateDate: new Date().toISOString(),
        });
        console.log("Utilisateur admin créé pour:", adminEmail);
      } catch (userError) {
        console.error("Erreur lors de la création de l'utilisateur admin:", userError);
        // On continue même si la création de l'utilisateur admin échoue
      }
    }

    try {
      const domainWithDetails = await domainQueries.findUniqueWithCounts(newDomain.id);
      
      // Si on n'arrive pas à récupérer les détails, on renvoie au moins le domaine créé
      if (!domainWithDetails) {
        console.log("Impossible de récupérer les détails, retour du domaine de base");
        return NextResponse.json({
          ...newDomain,
          users: [],
          _count: {
            users: 0,
            categories: 0,
            bookmark: 0,
          }
        }, { status: 201 });
      }

      console.log("Domaine avec détails récupéré:", domainWithDetails);
      return NextResponse.json(domainWithDetails, { status: 201 });
    } catch (detailsError) {
      console.error("Erreur lors de la récupération des détails:", detailsError);
      // Retourner le domaine créé même si on ne peut pas récupérer les détails
      return NextResponse.json({
        ...newDomain,
        users: [],
        _count: {
          users: 0,
          categories: 0,
          bookmark: 0,
        }
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Erreur lors de la création du domaine:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
