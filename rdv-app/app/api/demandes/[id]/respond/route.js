import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../../lib/supabase";
import { sendRecapEmail } from "../../../../../lib/email";

export async function POST(request, { params }) {
  const { restoChoice, activiteChoice } = await request.json();
  const supabase = getSupabaseServer();

  const { data: demande, error: demandeError } = await supabase
    .from("demandes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (demandeError || !demande) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }

  if (demande.status === "expired") {
    return NextResponse.json(
      { error: "Ce lien n'est plus actif : tout le monde a déjà répondu." },
      { status: 410 }
    );
  }

  const { error: insertError } = await supabase.from("reponses").insert({
    demande_id: params.id,
    resto_choice: restoChoice || null,
    activite_choice: activiteChoice || null,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // On vérifie si tout le monde a maintenant répondu
  const { data: reponses, count } = await supabase
    .from("reponses")
    .select("*", { count: "exact" })
    .eq("demande_id", params.id);

  if (count >= demande.nb_personnes) {
    await supabase
      .from("demandes")
      .update({ status: "expired", expired_at: new Date().toISOString() })
      .eq("id", params.id);

    await sendRecapEmail({ demande, reponses, missingCount: 0 });
  }

  return NextResponse.json({ ok: true });
}
