import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("User")
      .select("id, password")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { hasPassword: false, userExists: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      hasPassword: !!user.password,
      userExists: true
    });

  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
