"use client";

import { useEffect, useState } from "react";
import ChoiceGrid from "../../components/ChoiceGrid";
import { TYPE_LABELS } from "../../../lib/options";

function PerforatedDivider() {
  return (
    <div className="perf-divider" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="perf-dot" />
      ))}
    </div>
  );
}

export default function RecipientPage({ params }) {
  const [demande, setDemande] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | expired | notfound | done
  const [restoChoice, setRestoChoice] = useState(null);
  const [activiteChoice, setActiviteChoice] = useState(null);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetch(`/api/demandes/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus("notfound");
          return;
        }
        setDemande(data.demande);
        setStatus(data.demande.status === "expired" ? "expired" : "ready");
      })
      .catch(() => setStatus("notfound"));
  }, [params.id]);

  const respond = async () => {
    setSending(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/demandes/${params.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restoChoice, activiteChoice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue.");
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setSending(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="app-root">
        <div className="card-shell"><div className="ticket"><div className="landing"><p>Chargement...</p></div></div></div>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="app-root">
        <div className="card-shell">
          <div className="ticket"><div className="landing">
            <h1 className="headline">Lien introuvable</h1>
            <p className="subtext">Ce lien n'existe pas ou a été supprimé.</p>
          </div></div>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="app-root">
        <div className="card-shell">
          <div className="ticket"><div className="landing">
            <h1 className="headline">Ce lien n'est plus actif</h1>
            <p className="subtext">Tout le monde a déjà répondu à cette demande.</p>
          </div></div>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="app-root">
        <div className="card-shell">
          <div className="ticket">
            <div className="confirm-screen">
              <div className="confirm-icon">✓</div>
              <h1 className="question">Réponse envoyée</h1>
              <p className="subtext">
                {demande.creator_name} recevra un email récapitulatif dès que tout le monde aura répondu.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const restoOptions = demande.resto_options || [];
  const activiteOptions = demande.activite_options || [];
  const canValidate =
    (restoOptions.length === 0 || restoChoice) &&
    (activiteOptions.length === 0 || activiteChoice);

  return (
    <div className="app-root">
      <div className="card-shell">
        <div className="ticket">
          <div className="ticket-header">
            <div className="invite-hero">
              <div className="from">{demande.creator_name} t'invite à</div>
              <div className="headline">{TYPE_LABELS[demande.type] || "une sortie"}</div>
              <div className="datetime">{demande.date} · {demande.heure}</div>
            </div>
          </div>
          <PerforatedDivider />
          <div className="ticket-body">
            {restoOptions.length > 0 && (
              <>
                <p className="eyebrow" style={{ marginTop: 4 }}>Restaurant — choisis-en un</p>
                <ChoiceGrid options={restoOptions} selected={restoChoice} setSelected={setRestoChoice} multi={false} />
              </>
            )}
            {activiteOptions.length > 0 && (
              <>
                <p className="eyebrow" style={{ marginTop: 12 }}>Activité — choisis-en une</p>
                <ChoiceGrid options={activiteOptions} selected={activiteChoice} setSelected={setActiviteChoice} multi={false} />
              </>
            )}
            {errorMsg && <p className="helper-note" style={{ color: "#B3261E" }}>{errorMsg}</p>}
          </div>
          <div className="actions">
            <span />
            <button className="btn-primary" disabled={!canValidate || sending} onClick={respond}>
              {sending ? "Envoi..." : "Valider ma réponse"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
