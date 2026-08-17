// Ce fichier centralise les propositions pré-remplies par type de RDV.
// Pour en ajouter/modifier, il suffit de toucher ce fichier, rien d'autre.

export const RESTO_OPTIONS = {
  galant: ["Petit resto italien", "Bar à vin", "Sushi"],
  potes: ["Pizza", "Bar", "Tacos"],
  repas: ["Chez toi", "Resto de quartier", "Brunch"],
  autre: ["Pizza", "Resto", "Bar"],
};

export const ACTIVITY_OPTIONS = {
  galant: ["Balade", "Cinéma", "Exposition"],
  potes: ["Bowling", "Cinéma", "Karting"],
  repas: ["Aucune", "Jeux de société", "Balade digestive"],
  autre: ["Bowling", "Cinéma", "Karting"],
};

export const TYPE_LABELS = {
  galant: "un rendez-vous galant",
  potes: "une sortie entre potes",
  repas: "un repas",
  autre: "une sortie",
};
