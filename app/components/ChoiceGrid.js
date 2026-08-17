"use client";

export default function ChoiceGrid({ options, custom, setCustom, selected, setSelected, multi }) {
  const toggle = (opt) => {
    if (multi) {
      setSelected((prev) =>
        prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
      );
    } else {
      setSelected(selected === opt ? null : opt);
    }
  };
  const isSelected = (opt) => (multi ? selected.includes(opt) : selected === opt);

  return (
    <div>
      <div className="choice-grid">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`choice-card ${isSelected(opt) ? "choice-card-active" : ""}`}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {setCustom && (
        <div className="custom-field">
          <label>Autre idée ?</label>
          <input
            type="text"
            placeholder="Écris ta proposition..."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
