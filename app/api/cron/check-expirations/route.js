import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabase";
import { sendRecapEmail } from "../../../../lib/email";

// Cette route est appelée automatiquement une fois par jour par Vercel Cron
// (voir vercel.json). Elle s'occupe uniquement du cas :
// "plus de 6 invités, on est à 4 jours ou moins de la sortie,
// et tout le monde n'a pas encore répondu" -> on envoie le récap quand même.
export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const supabase = getSupabaseServer();

  const { data: demandes, error } = await supabase
    .from("demandes")
    .select("*")
    .eq("status", "active")
    .gt("nb_personnes", 6);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();
  let traitees = 0;

  for (const demande of demandes || []) {
    const dateRdv = new Date(`${demande.date}T${demande.heure}`);
    const joursRestants = (dateRdv - now) / (1000 * 60 * 60 * 24);

    if (joursRestants <= 4) {
      const { data: reponses } = await supabase
        .from("reponses")
        .select("*")
        .eq("demande_id", demande.id);

      const missingCount = demande.nb_personnes - (reponses?.length || 0);

      await supabase
        .from("demandes")
        .update({ status: "expired", expired_at: now.toISOString() })
        .eq("id", demande.id);

      await sendRecapEmail({ demande, reponses: reponses || [], missingCount });
      traitees += 1;
    }
  }

  return NextResponse.json({ ok: true, traitees });
}
