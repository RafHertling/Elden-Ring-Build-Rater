import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = "https://eldenring.fanapis.com/api";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const norm = (s) => (s || "").toString().trim().toLowerCase();

const getScalingPoints = (scaling) => {
  const s = norm(scaling);
  if (s === "s") return 10;
  if (s === "a") return 8;
  if (s === "b") return 6;
  if (s === "c") return 4;
  if (s === "d") return 2;
  if (s === "e") return 1;
  return 0;
};

const sumAttack = (weapon) => {
  const arr = Array.isArray(weapon?.attack) ? weapon.attack : [];
  return arr.reduce((acc, x) => acc + (Number(x?.amount) || 0), 0);
};

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function SearchSelect({
  label,
  placeholder,
  endpoint,
  value,
  onPick,
  filterFn,
  badge,
}) {
  const [query, setQuery] = useState(value?.name || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const debounced = useDebouncedValue(query, 250);
  const boxRef = useRef(null);

  useEffect(() => {
    setQuery(value?.name || "");
  }, [value?.name]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const q = debounced.trim();
    if (!open) return;
    if (q.length < 2) {
      setItems([]);
      setError("");
      return;
    }

    const ctrl = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const url = `${API_BASE}${endpoint}?name=${encodeURIComponent(q)}&limit=12`;
        const res = await fetch(url, { signal: ctrl.signal });
        const json = await res.json();
        const raw = Array.isArray(json?.data) ? json.data : [];
        const filtered = filterFn ? raw.filter(filterFn) : raw;
        setItems(filtered.slice(0, 10));
      } catch (e) {
        if (e?.name !== "AbortError") setError("API error. Try again.");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ctrl.abort();
  }, [debounced, endpoint, open, filterFn]);

  const clear = () => {
    setQuery("");
    setItems([]);
    onPick(null);
  };

  return (
    <div ref={boxRef} className="relative">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm text-zinc-200">{label}</label>
        {badge ? (
          <span className="rounded-full bg-zinc-900/70 px-2 py-0.5 text-[11px] text-zinc-300 ring-1 ring-zinc-700">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-xl bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/70"
          />
          {loading ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
              loading…
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={clear}
          className="rounded-xl bg-zinc-900/70 px-3 py-3 text-sm text-zinc-200 ring-1 ring-zinc-800 hover:bg-zinc-900"
        >
          Clear
        </button>
      </div>

      {open ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl bg-zinc-950/95 ring-1 ring-zinc-800 backdrop-blur">
          {error ? (
            <div className="px-4 py-3 text-sm text-red-300">{error}</div>
          ) : null}

          {!error && query.trim().length < 2 ? (
            <div className="px-4 py-3 text-sm text-zinc-400">
              Type at least 2 letters…
            </div>
          ) : null}

          {!error && query.trim().length >= 2 && items.length === 0 && !loading ? (
            <div className="px-4 py-3 text-sm text-zinc-400">No results.</div>
          ) : null}

          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => {
                onPick(it);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900/70"
            >
              <img
                src={it.image}
                alt={it.name}
                className="h-10 w-10 rounded-lg object-cover ring-1 ring-zinc-800"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-zinc-100">{it.name}</div>
                <div className="truncate text-xs text-zinc-400">
                  {it.category || it.effect || it.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {value ? (
        <div className="mt-2 rounded-xl bg-zinc-950/50 p-3 ring-1 ring-zinc-800">
          <div className="flex items-center gap-3">
            <img
              src={value.image}
              alt={value.name}
              className="h-12 w-12 rounded-xl object-cover ring-1 ring-zinc-800"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-zinc-100">{value.name}</div>
              <div className="truncate text-xs text-zinc-400">
                {value.category || value.effect || ""}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function computeScore(state) {
  const selected = [
    state.weapon1,
    state.weapon2,
    state.helm,
    state.chest,
    state.legs,
    state.boots,
    state.talisman1,
    state.talisman2,
    state.talisman3,
    state.talisman4,
  ].filter(Boolean).length;

  let score = 0;
  const reasons = [];

  score += Math.min(40, selected * 4);

  const w1 = state.weapon1;
  const w2 = state.weapon2;

  const attack1 = w1 ? sumAttack(w1) : 0;
  const attack2 = w2 ? sumAttack(w2) : 0;

  const scalePts = (w) => {
    const scales = Array.isArray(w?.scalesWith) ? w.scalesWith : [];
    return scales.reduce((acc, s) => acc + getScalingPoints(s?.scaling), 0);
  };

  if (w1) {
    const s = clamp(Math.round((attack1 / 250) * 18), 0, 18) + clamp(scalePts(w1), 0, 12);
    score += clamp(s, 0, 28);
    reasons.push(`Weapon 1 contributes +${clamp(s, 0, 28)} (attack/scaling).`);
  }

  if (w2) {
    const s = clamp(Math.round((attack2 / 250) * 10), 0, 10) + clamp(Math.round(scalePts(w2) * 0.6), 0, 8);
    score += clamp(s, 0, 16);
    reasons.push(`Weapon 2 contributes +${clamp(s, 0, 16)} (support/offhand).`);
  }

  const texts = [
    w1?.name,
    w1?.description,
    w1?.category,
    w2?.name,
    w2?.description,
    w2?.category,
    state.talisman1?.name,
    state.talisman1?.effect,
    state.talisman2?.name,
    state.talisman2?.effect,
    state.talisman3?.name,
    state.talisman3?.effect,
    state.talisman4?.name,
    state.talisman4?.effect,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const type = state.buildType;

  const keywordMap = {
    Strength: ["colossal", "great", "hammer", "heavy", "strength", "jump", "charge"],
    Dexterity: ["katana", "curved", "keen", "dex", "multi", "successive"],
    Intelligence: ["staff", "glintstone", "sorcery", "magic", "carian", "int"],
    Faith: ["seal", "incant", "faith", "flame", "lightning", "holy"],
    Arcane: ["bleed", "blood", "occult", "poison", "arc", "rot"],
  };

  const hits = (keywordMap[type] || []).filter((k) => texts.includes(k)).length;
  const synergy = clamp(hits * 5, 0, 20);
  score += synergy;

  if (synergy >= 15) reasons.push("Synergy looks strong for your chosen build type.");
  else if (synergy >= 8) reasons.push("Synergy is decent, but could be tighter.");
  else reasons.push("Synergy seems low—your items might not match your chosen build type.");

  const armorCount = [state.helm, state.chest, state.legs, state.boots].filter(Boolean).length;
  score += clamp(armorCount * 3, 0, 12);

  const taliCount = [state.talisman1, state.talisman2, state.talisman3, state.talisman4].filter(Boolean).length;
  score += clamp(taliCount * 3, 0, 12);

  const final = clamp(Math.round(score), 0, 100);
  return { score: final, reasons: reasons.slice(0, 5) };
}

function ScoreBar({ score }) {
  const label =
    score >= 85 ? "S-Tier" : score >= 70 ? "A-Tier" : score >= 55 ? "B-Tier" : score >= 40 ? "C-Tier" : "D-Tier";

  return (
    <div className="rounded-2xl bg-zinc-950/60 p-5 ring-1 ring-zinc-800">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <div className="text-sm text-zinc-400">Build rating</div>
          <div className="text-3xl font-semibold text-zinc-100">{score}/100</div>
        </div>
        <div className="rounded-full bg-yellow-500/15 px-3 py-1 text-sm text-yellow-200 ring-1 ring-yellow-500/30">
          {label}
        </div>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-900 ring-1 ring-zinc-800">
        <div
          className="h-full rounded-full bg-linear-to-r from-yellow-600 to-yellow-300"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function Builder() {
  const [state, setState] = useState({
    weapon1: null,
    weapon2: null,
    helm: null,
    chest: null,
    legs: null,
    boots: null,
    talisman1: null,
    talisman2: null,
    talisman3: null,
    talisman4: null,
    buildType: "Strength",
    notes: "",
  });

  const { score, reasons } = useMemo(() => computeScore(state), [state]);

  return (
    <div className="min-h-screen bg-linear-to-r from-zinc-950 via-zinc-950 to-black px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">
            Elden Ring Build Rater
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Pick your gear with autocomplete from the Elden Ring API, then get a 0–100 rating.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-zinc-950/50 p-6 ring-1 ring-zinc-800 backdrop-blur">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-lg font-medium">Your Build</div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">Build type</span>
                <select
                  value={state.buildType}
                  onChange={(e) => setState((s) => ({ ...s, buildType: e.target.value }))}
                  className="rounded-xl bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/70"
                >
                  <option>Strength</option>
                  <option>Dexterity</option>
                  <option>Intelligence</option>
                  <option>Faith</option>
                  <option>Arcane</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <SearchSelect
                label="1. Weapon"
                placeholder="Search weapon… (e.g. Moonveil)"
                endpoint="/weapons"
                value={state.weapon1}
                onPick={(item) => setState((s) => ({ ...s, weapon1: item }))}
                badge="API: /weapons"
              />
              <SearchSelect
                label="2. Weapon"
                placeholder="Search weapon…"
                endpoint="/weapons"
                value={state.weapon2}
                onPick={(item) => setState((s) => ({ ...s, weapon2: item }))}
              />

              <SearchSelect
                label="Helmet"
                placeholder="Search helmet…"
                endpoint="/armors"
                value={state.helm}
                onPick={(item) => setState((s) => ({ ...s, helm: item }))}
                filterFn={(a) => norm(a?.category).includes("helm")}
                badge="API: /armors"
              />
              <SearchSelect
                label="Chest"
                placeholder="Search chest…"
                endpoint="/armors"
                value={state.chest}
                onPick={(item) => setState((s) => ({ ...s, chest: item }))}
                filterFn={(a) => norm(a?.category).includes("chest")}
              />

              <SearchSelect
                label="Legs"
                placeholder="Search legs…"
                endpoint="/armors"
                value={state.legs}
                onPick={(item) => setState((s) => ({ ...s, legs: item }))}
                filterFn={(a) => norm(a?.category).includes("leg")}
              />
              <SearchSelect
                label="Boots"
                placeholder="Search boots…"
                endpoint="/armors"
                value={state.boots}
                onPick={(item) => setState((s) => ({ ...s, boots: item }))}
                filterFn={(a) => norm(a?.category).includes("boot") || norm(a?.category).includes("foot")}
              />

              <SearchSelect
                label="Talisman 1"
                placeholder="Search talisman…"
                endpoint="/talismans"
                value={state.talisman1}
                onPick={(item) => setState((s) => ({ ...s, talisman1: item }))}
                badge="API: /talismans"
              />
              <SearchSelect
                label="Talisman 2"
                placeholder="Search talisman…"
                endpoint="/talismans"
                value={state.talisman2}
                onPick={(item) => setState((s) => ({ ...s, talisman2: item }))}
              />

              <SearchSelect
                label="Talisman 3"
                placeholder="Search talisman…"
                endpoint="/talismans"
                value={state.talisman3}
                onPick={(item) => setState((s) => ({ ...s, talisman3: item }))}
              />
              <SearchSelect
                label="Talisman 4"
                placeholder="Search talisman…"
                endpoint="/talismans"
                value={state.talisman4}
                onPick={(item) => setState((s) => ({ ...s, talisman4: item }))}
              />
            </div>

            <div className="mt-6">
              <label className="mb-1 block text-sm text-zinc-200">Notes (optional)</label>
              <textarea
                value={state.notes}
                onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
                placeholder="Add playstyle, level, NG+, PvP/PvE…"
                className="min-h-22.5 w-full rounded-2xl bg-zinc-950/60 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/70"
              />
            </div>
          </div>

          <div className="space-y-6">
            <ScoreBar score={score} />

            <div className="rounded-3xl bg-zinc-950/50 p-6 ring-1 ring-zinc-800">
              <div className="mb-3 text-lg font-medium">Why this score?</div>
              <ul className="space-y-2 text-sm text-zinc-300">
                {reasons.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-yellow-400/80" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-2xl bg-zinc-950/60 p-4 ring-1 ring-zinc-800">
                <div className="text-sm text-zinc-400">Tip</div>
                <div className="mt-1 text-sm text-zinc-200">
                  Für bessere Ratings: wähle ein klares Build-Type + passende Weapon Scaling + Talismans, die exakt deine Damage-Schiene buffen.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setState({
                  weapon1: null,
                  weapon2: null,
                  helm: null,
                  chest: null,
                  legs: null,
                  boots: null,
                  talisman1: null,
                  talisman2: null,
                  talisman3: null,
                  talisman4: null,
                  buildType: "Strength",
                  notes: "",
                })
              }
              className="w-full rounded-2xl bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 ring-1 ring-zinc-800 hover:bg-zinc-900"
            >
              Reset Build
            </button>
          </div>
        </div>

        <div className="mt-8 text-xs text-zinc-500">
          Data source: Elden Ring API (no key required). :contentReference[oaicite:4]
        </div>
      </div>
    </div>
  );
}

export default Builder;
