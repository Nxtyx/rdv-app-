import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabase";

export async function GET(request, { params }) {
  const supabase = getSupabaseServer();

  const { data: demande, error } = await supabase
    .from("demandes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !demande) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }

  const { count } = await supabase
    .from("reponses")
    .select("*", { count: "exact", head: true })
    .eq("demande_id", params.id);

  return NextResponse.json({ demande, nbReponses: count || 0 });
}
