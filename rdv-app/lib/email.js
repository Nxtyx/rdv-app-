import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const TYPE_LABELS = {
  galant: "un rendez-vous galant",
  potes: "une sortie entre potes",
  repas: "un repas",
  autre: "une sortie",
};

// Envoie l'email récapitulatif au créateur avec toutes les réponses reçues.
// "missingCount" est > 0 uniquement dans le cas "4 jours avant, +6 personnes,
// tout le monde n'a pas répondu".
export async function sendRecapEmail({ demande, reponses, missingCount = 0 }) {
  const label = TYPE_LABELS[demande.type] || "une sortie";

  const lignesReponses = reponses
    .map((r, i) => {
      const parts = [];
      if (r.resto_choice) parts.push(`Restaurant : ${r.resto_choice}`);
      if (r.activite_choice) parts.push(`Activité : ${r.activite_choice}`);
      return `Personne ${i + 1} — ${parts.join(" · ") || "aucune préférence"}`;
    })
    .join("\n");

  const missingLine =
    missingCount > 0
      ? `\n\n${missingCount} personne(s) n'ont pas encore répondu (délai de 4 jours avant la sortie atteint).`
      : "";

  const text = `Bonjour ${demande.creator_name},

Voici le récap des réponses pour ${label} du ${demande.date} à ${demande.heure} :

${lignesReponses || "Aucune réponse reçue."}${missingLine}
`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: demande.creator_email,
    subject: `Récap de tes réponses — ${label}`,
    text,
  });
}
