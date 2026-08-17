import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase";

export async function POST(request) {
  const body = await request.json();
  const {
    creatorName,
    creatorEmail,
    type,
    date,
    heure,
    nbPersonnes,
    restoOptions,
    activiteOptions,
  } = body;

  if (!creatorName || !creatorEmail || !type || !date || !heure || !nbPersonnes) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("demandes")
    .insert({
      creator_name: creatorName,
      creator_email: creatorEmail,
      type,
      date,
      heure,
      nb_personnes: nbPersonnes,
      resto_options: restoOptions || [],
      activite_options: activiteOptions || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/r/${data.id}`;

  return NextResponse.json({ demande: data, link });
}
