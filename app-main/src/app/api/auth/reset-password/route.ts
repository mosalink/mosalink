import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";
import { sendResetMail } from "@/services/mail/sendResetMail";
import { randomBytes } from "crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  // Vérifier que l'utilisateur existe
  const { data: user, error } = await supabaseAdmin
    .from("User")
    .select("id, email")
    .eq("email", email)
    .single();
  if (error || !user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

  // Générer un token unique (valable 1h)
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await supabaseAdmin.from("User").update({ reset_token: token, reset_token_expires: expires }).eq("email", email);

  const resetUrl = `${BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  try {
    await sendResetMail({
      to: email,
      resetUrl,
    });
  } catch (e) {
    console.error("Erreur lors de l'envoi du mail de reset:", e);
    return NextResponse.json({ error: "Erreur lors de l'envoi du mail" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
