"use client";

import { useState } from "react";
import ChoiceGrid from "../components/ChoiceGrid";
import { RESTO_OPTIONS, ACTIVITY_OPTIONS, TYPE_LABELS } from "../../lib/options";

const STEPS = ["identite", "type", "quandcombien", "resto", "activite", "resume"];

function PerforatedDivider() {
  return (
    <div className="perf-divider" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="perf-dot" />
      ))}
    </div>
  );
}

function ProgressStub({ step }) {
  const idx = STEPS.indexOf(step);
  return (
    <div className="progress-stub">
      {STEPS.map((s, i) => (
        <div key={s} className={`stub ${i <= idx ? "stub-active" : ""}`} />
      ))}
    </div>
  );
}

export default function CreatePage() {
  const [step, setStep] = useState("identite");
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [type, setType] = useState(null);
  const [nbPersonnes, setNbPersonnes] = useState(1);
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [restoSelected, setRestoSelected] = useState([]);
  const [restoCustom, setRestoCustom] = useState("");
  const [activiteSelected, setActiviteSelected] = useState([]);
  const [activiteCustom, setActiviteCustom] = useState("");
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const restoAllOptions = type ? RESTO_OPTIONS[type] : [];
  const activiteAllOptions = type ? ACTIVITY_OPTIONS[type] : [];
  const finalRestoOptions = [...restoSelected, ...(restoCustom ? [restoCustom] : [])];
  const finalActiviteOptions = [...activiteSelected, ...(activiteCustom ? [activiteCustom] : [])];

  const canProceed = () => {
    if (step === "identite") return creatorName.trim() && creatorEmail.trim().includes("@");
    if (step === "type") return !!type;
    if (step === "quandcombien") return date && heure && nbPersonnes >= 1;
    return true;
  };

  const submit = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorName,
          creatorEmail,
          type,
          date,
          heure,
          nbPersonnes,
          restoOptions: finalRestoOptions,
          activiteOptions: finalActiviteOptions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue.");
      setLink(data.link);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="card-shell">
        <div className="brand-row">
          <div className="brand">
            Toi<span className="brand-accent">Décide</span>
          </div>
        </div>

        <div className="ticket">
          <ProgressStub step={step} />

          {step === "identite" && (
            <>
              <div className="ticket-header">
                <p className="eyebrow">Étape 1</p>
                <h1 className="question">C'est toi qui invites. On commence par toi.</h1>
                <p className="subtext">Ton email sert uniquement à te transmettre le récap des réponses.</p>
              </div>
              <PerforatedDivider />
              <div className="ticket-body">
                <div className="field">
                  <label>Ton prénom</label>
                  <input type="text" placeholder="Ex : Lucas" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} />
                </div>
                <div className="field">
                  <label>Ton email</label>
                  <input type="email" placeholder="ton@email.com" value={creatorEmail} onChange={(e) => setCreatorEmail(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {step === "type" && (
            <>
              <div className="ticket-header">
                <p className="eyebrow">Étape 2</p>
                <h1 className="question">Quel genre de sortie tu proposes ?</h1>
              </div>
              <PerforatedDivider />
              <div className="ticket-body">
                <div className="type-grid">
                  {[
                    ["galant", "💌", "Rendez-vous galant"],
                    ["potes", "🎉", "Sortie entre potes"],
                    ["repas", "🍽️", "Repas"],
                    ["autre", "✨", "Autre"],
                  ].map(([key, emoji, label]) => (
                    <button key={key} type="button" className={`type-card ${type === key ? "type-card-active" : ""}`} onClick={() => setType(key)}>
                      <span className="type-card-emoji">{emoji}</span>
                      <span className="type-card-label">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === "quandcombien" && (
            <>
              <div className="ticket-header">
                <p className="eyebrow">Étape 3</p>
                <h1 className="question">Combien de personnes, et pour quand ?</h1>
              </div>
              <PerforatedDivider />
              <div className="ticket-body">
                <div className="field">
                  <label>Nombre de personnes invitées</label>
                  <div className="stepper-nb">
                    <button className="stepper-btn" onClick={() => setNbPersonnes((n) => Math.max(1, n - 1))}>−</button>
                    <span className="stepper-value">{nbPersonnes}</span>
                    <button className="stepper-btn" onClick={() => setNbPersonnes((n) => n + 1)}>+</button>
                  </div>
                </div>
                <div className="row-2">
                  <div className="field">
                    <label>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Heure</label>
                    <input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
                  </div>
                </div>
                {nbPersonnes > 6 && (
                  <p className="helper-note">
                    À plus de 6 invités : si tout le monde n'a pas répondu, le récap te sera envoyé automatiquement 4 jours avant la date, avec le nombre de personnes n'ayant pas répondu.
                  </p>
                )}
              </div>
            </>
          )}

          {step === "resto" && (
            <>
              <div className="ticket-header">
                <p className="eyebrow">Étape 4</p>
                <h1 className="question">Des idées de restaurant ?</h1>
                <p className="subtext">Tu peux en cocher plusieurs, ou aucune.</p>
              </div>
              <PerforatedDivider />
              <div className="ticket-body">
                <ChoiceGrid options={restoAllOptions} custom={restoCustom} setCustom={setRestoCustom} selected={restoSelected} setSelected={setRestoSelected} multi />
              </div>
            </>
          )}

          {step === "activite" && (
            <>
              <div className="ticket-header">
                <p className="eyebrow">Étape 5</p>
                <h1 className="question">Et côté activité ?</h1>
                <p className="subtext">Tu peux en cocher plusieurs, ou aucune.</p>
              </div>
              <PerforatedDivider />
              <div className="ticket-body">
                <ChoiceGrid options={activiteAllOptions} custom={activiteCustom} setCustom={setActiviteCustom} selected={activiteSelected} setSelected={setActiviteSelected} multi />
              </div>
            </>
          )}

          {step === "resume" && (
            <>
              <div className="ticket-header">
                <p className="eyebrow">Dernière étape</p>
                <h1 className="question">{link ? "Ton lien est prêt" : "Vérifie avant d'envoyer"}</h1>
              </div>
              <PerforatedDivider />
              <div className="ticket-body">
                <div className="summary-block">
                  <div className="summary-label">Type</div>
                  <div className="summary-value">{TYPE_LABELS[type] || "—"}</div>
                </div>
                <div className="summary-block">
                  <div className="summary-label">Quand</div>
                  <div className="summary-value">{date || "—"} à {heure || "—"} · {nbPersonnes} personne{nbPersonnes > 1 ? "s" : ""} invitée{nbPersonnes > 1 ? "s" : ""}</div>
                </div>
                <div className="summary-block">
                  <div className="summary-label">Restaurant</div>
                  {finalRestoOptions.length ? (
                    <div className="tag-list">{finalRestoOptions.map((o) => <span className="tag" key={o}>{o}</span>)}</div>
                  ) : <div className="summary-value">Aucune proposition</div>}
                </div>
                <div className="summary-block">
                  <div className="summary-label">Activité</div>
                  {finalActiviteOptions.length ? (
                    <div className="tag-list">{finalActiviteOptions.map((o) => <span className="tag" key={o}>{o}</span>)}</div>
                  ) : <div className="summary-value">Aucune proposition</div>}
                </div>

                {errorMsg && <p className="helper-note" style={{ color: "#B3261E" }}>{errorMsg}</p>}

                {link && (
                  <>
                    <div className="link-box">{link}</div>
                    <p className="helper-note">
                      Copie ce lien et envoie-le toi-même (SMS, WhatsApp...) à {nbPersonnes} personne{nbPersonnes > 1 ? "s" : ""}.
                    </p>
                  </>
                )}
              </div>
            </>
          )}

          <div className="actions">
            {step !== "identite" ? <button className="btn-ghost" onClick={goBack}>← Retour</button> : <span />}
            {step !== "resume" && (
              <button className="btn-primary" disabled={!canProceed()} onClick={goNext}>Continuer →</button>
            )}
            {step === "resume" && !link && (
              <button className="btn-primary" disabled={loading} onClick={submit}>
                {loading ? "Création..." : "Générer le lien"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
