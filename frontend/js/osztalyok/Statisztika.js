const KATEGORIA_API = "/api/kategoriak";

const RADAR_CSUCCSOK = [
  { cx: 50, cy: 5 },
  { cx: 95, cy: 38 },
  { cx: 78, cy: 90 },
  { cx: 22, cy: 90 },
  { cx: 5, cy: 38 },
];

const RADAR_KOZEPPONT = { x: 50, y: 50 };
const RADAR_CIMKE_OSZTALYOK = ["logic", "creativity", "health", "social", "soul"];

function maiDatum() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function datumString(datum) {
  return `${datum.getFullYear()}-${String(datum.getMonth() + 1).padStart(2, "0")}-${String(datum.getDate()).padStart(2, "0")}`;
}

function pontokraVektor(csuccs, arany) {
  const x = RADAR_KOZEPPONT.x + (csuccs.cx - RADAR_KOZEPPONT.x) * arany;
  const y = RADAR_KOZEPPONT.y + (csuccs.cy - RADAR_KOZEPPONT.y) * arany;
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

export class RadarDiagram {
  #svg;
  #terulet;
  #felhasznaloId;

  constructor(szelektor, felhasznaloId = null) {
    this.#svg = document.querySelector(szelektor);
    this.#terulet = this.#svg?.querySelector(".radar-terulet");
    this.#felhasznaloId = felhasznaloId;
  }

  felhasznaloIdBeallitas(felhasznaloId) {
    this.#felhasznaloId = felhasznaloId;
  }

  async frissit() {
    if (!this.#svg || !this.#terulet) return;
    if (!this.#felhasznaloId) return this.#alaphelyzet();
    try {
      const valasz = await fetch(`${KATEGORIA_API}?felhasznaloId=${this.#felhasznaloId}`);
      if (!valasz.ok) return this.#alaphelyzet();
      const kategoriak = await valasz.json();
      const maxPont = Math.max(1, ...kategoriak.map((k) => k.pontok));
      const sokszogPontok = kategoriak.map((k, i) => {
        const arany = Math.min(1, k.pontok / maxPont);
        return pontokraVektor(RADAR_CSUCCSOK[i], 0.05 + arany * 0.95);
      });
      this.#terulet.setAttribute("points", sokszogPontok.join(" "));
      this.#cimkekFrissit(kategoriak);
    } catch {
      this.#alaphelyzet();
    }
  }

  #alaphelyzet() {
    this.#terulet.setAttribute("points", "50,47 53,50 50,53 47,50");
    this.#cimkekFrissit([]);
  }

  #cimkekFrissit(kategoriak) {
    RADAR_CIMKE_OSZTALYOK.forEach((osztalyNev, i) => {
      const elem = document.querySelector(`.cimke.${osztalyNev}`);
      if (!elem) return;
      const k = kategoriak[i];
      elem.textContent = k
        ? `${k.nev.toUpperCase()}${k.pontok > 0 ? ` · ${k.pontok}` : ""}`
        : osztalyNev.toUpperCase();
    });
  }
}

export class MiniKartya {
  #felhasznaloId;

  constructor(felhasznaloId = null) {
    this.#felhasznaloId = felhasznaloId ? Number(felhasznaloId) : null;
    this.#toggleEsemeny();
    this.#streakEllenorzes();
    this.#streakMegjelenit();
  }

  felhasznaloIdBeallitas(felhasznaloId) {
    this.#felhasznaloId = felhasznaloId ? Number(felhasznaloId) : null;
    this.#streakEllenorzes();
    this.#streakMegjelenit();
  }

  streakNapotRogzit() {
    if (!this.#felhasznaloId) return;
    const kulcs = `streak_${this.#felhasznaloId}`;
    const ma = maiDatum();
    const mentett = JSON.parse(localStorage.getItem(kulcs)) ?? { count: 0, lastDate: null };
    if (mentett.lastDate === ma) return;
    mentett.count += 1;
    mentett.lastDate = ma;
    localStorage.setItem(kulcs, JSON.stringify(mentett));
    this.#streakMegjelenit();
  }

  #streakEllenorzes() {
    if (!this.#felhasznaloId) return;
    const kulcs = `streak_${this.#felhasznaloId}`;
    const mentett = JSON.parse(localStorage.getItem(kulcs));
    if (!mentett?.lastDate) return;
    const tegnap = new Date();
    tegnap.setDate(tegnap.getDate() - 1);
    if (mentett.lastDate < datumString(tegnap)) {
      localStorage.setItem(kulcs, JSON.stringify({ count: 0, lastDate: null }));
    }
  }

  #streakMegjelenit() {
    const elem = document.querySelector(".statisztika-racs .mini-kartya:first-child p");
    if (!elem) return;
    if (!this.#felhasznaloId) {
      elem.textContent = "0 Days";
      return;
    }
    const { count = 0 } = JSON.parse(localStorage.getItem(`streak_${this.#felhasznaloId}`)) ?? {};
    elem.textContent = `${count} Day${count !== 1 ? "s" : ""}`;
  }

  #toggleEsemeny() {
    document.querySelectorAll(".statisztika-racs details").forEach((details) => {
      details.addEventListener("toggle", (e) => {
        const state = e.target.open;
        document.querySelectorAll(".statisztika-racs details").forEach((el) => {
          if (el.open !== state) el.open = state;
        });
      });
    });
  }
}
