import Link from "next/link";

export default function Home() {
  return (
    <div className="app-root">
      <div className="card-shell">
        <div className="brand-row">
          <div className="brand">
            Toi<span className="brand-accent">Décide</span>
          </div>
        </div>
        <div className="ticket">
          <div className="landing">
            <h1 className="headline">Propose une sortie.<br />Laisse-la choisir.</h1>
            <p className="subtext">
              Rendez-vous galant, sortie entre potes ou repas : crée ta demande,
              envoie le lien, reçois la réponse par email.
            </p>
            <Link href="/create" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
              Créer un RDV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
