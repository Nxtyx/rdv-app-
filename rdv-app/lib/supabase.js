import { createClient } from "@supabase/supabase-js";

// Client "service role" : utilisé uniquement côté serveur (API routes),
// jamais exposé au navigateur. Il a le droit d'écrire/lire sans restriction.
export function getSupabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
