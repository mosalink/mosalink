// Ajout de dev-login, connexion pour l'environnement de dev

import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { userQueries, sessionQueries } from "../../../../lib/supabase-queries";

export async function POST(request: Request) {
  // Seulement en développement
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    // Vérifier que l'utilisateur existe
    const user = await userQueries.findUnique({ email });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Créer une session directement
    const sessionToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

    // Créer la session dans la base de données
    await sessionQueries.create({
      sessionToken,
      userId: user.id,
      expires: expires.toISOString(),
    });

    const token = await encode({
      token: {
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.image,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Connexion réussie",
      redirectUrl: "/"
    }, {
      headers: {
        'Set-Cookie': [
          `next-auth.session-token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`,
          `next-auth.csrf-token=${crypto.randomUUID()}; Path=/; HttpOnly; SameSite=Lax`
        ].join(', ')
      }
    });

  } catch (error) {
    console.error("Erreur dev-login:", error);
    return NextResponse.json({ error: "Erreur interne: " + (error as Error).message }, { status: 500 });
  }
}
