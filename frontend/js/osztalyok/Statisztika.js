const KATEGORIA_API = "/api/kategoriak";

const RADAR_NEVSOR = ["Logic", "Creativity", "Health", "Social", "Soul"];

const RADAR_CSUCCSOK = [
  { cx: 50, cy: 5 },
  { cx: 95, cy: 38 },
  { cx: 78, cy: 90 },
  { cx: 22, cy: 90 },
  { cx: 5, cy: 38 },
];

const RADAR_KOZEPPONT = { x: 50, y: 50 };

function pontokraVektor(csuccs, arany) {
  const x = RADAR_KOZEPPONT.x + (csuccs.cx - RADAR_KOZEPPONT.x) * arany;
  const y = RADAR_KOZEPPONT.y + (csuccs.cy - RADAR_KOZEPPONT.y) * arany;
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

function maiDatum() {
  return new Date().toISOString().slice(0, 10);
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
    if (!this.#felhasznaloId) {
      this.#alaphelyzet();
      return;
    }
    try {
      const valasz = await fetch(
        `${KATEGORIA_API}?felhasznaloId=${this.#felhasznaloId}`
      );
      if (!valasz.ok) {
        this.#alaphelyzet();
        return;
      }
      const kategoriak = await valasz.json();
      const pontTerkep = {};
      kategoriak.forEach((k) => {
        pontTerkep[k.nev] = k.pontok;
      });
      const maxPont = Math.max(1, ...Object.values(pontTerkep));
      const sokszogPontok = RADAR_NEVSOR.map((nev, i) => {
        const arany = Math.min(1, (pontTerkep[nev] ?? 0) / maxPont);
        const minimum = 0.05;
        return pontokraVektor(
          RADAR_CSUCCSOK[i],
          minimum + arany * (1 - minimum)
        );
      });
      this.#terulet.setAttribute("points", sokszogPontok.join(" "));
      this.#cimkekFrissit(pontTerkep);
    } catch (e) {
      console.error("Radar diagram frissítése sikertelen:", e);
      this.#alaphelyzet();
    }
  }

  #alaphelyzet() {
    this.#terulet.setAttribute("points", "50,47 53,50 50,53 47,50");
    this.#cimkekFrissit({});
  }

  #cimkekFrissit(pontTerkep) {
    const cimkeOsztalyok = ["logic", "creativity", "health", "social", "soul"];
    RADAR_NEVSOR.forEach((nev, i) => {
      const elem = document.querySelector(`.cimke.${cimkeOsztalyok[i]}`);
      if (elem) {
        const pont = pontTerkep[nev] ?? 0;
        elem.textContent = `${nev.toUpperCase()}${
          pont > 0 ? ` · ${pont}` : ""
        }`;
      }
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
    const mentett = JSON.parse(localStorage.getItem(kulcs)) ?? {
      count: 0,
      lastDate: null,
    };
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
    const utolso = new Date(mentett.lastDate);
    const ma = new Date(maiDatum());
    const kulonbseg = (ma - utolso) / (1000 * 60 * 60 * 24);
    if (kulonbseg > 1) {
      localStorage.setItem(kulcs, JSON.stringify({ count: 0, lastDate: null }));
    }
  }

  #streakMegjelenit() {
    const elem = document.querySelector(
      ".statisztika-racs .mini-kartya:first-child p"
    );
    if (!elem) return;
    if (!this.#felhasznaloId) {
      elem.textContent = "0 Days";
      return;
    }
    const kulcs = `streak_${this.#felhasznaloId}`;
    const mentett = JSON.parse(localStorage.getItem(kulcs)) ?? { count: 0 };
    elem.textContent = `${mentett.count} Day${mentett.count !== 1 ? "s" : ""}`;
  }

  #toggleEsemeny() {
    document
      .querySelectorAll(".statisztika-racs details")
      .forEach((details) => {
        details.addEventListener("toggle", (e) => {
          const state = e.target.open;
          document
            .querySelectorAll(".statisztika-racs details")
            .forEach((el) => {
              if (el.open !== state) el.open = state;
            });
        });
      });
  }
}
