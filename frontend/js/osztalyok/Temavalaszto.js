import { Modal } from "../ui/Modal.js";

const TEMAK = {
  girlipop: {
    "--szin-tema-hatter": "#ede2e4",
    "--szin-tema-hatter-eltero": "#e3d9f5",
    "--szin-tema-szegely": "#bb8a8e",
    "--szin-tema-mely": "#efa4af",
    "--szin-tema-kiemelt": "#a43953",
    "--szin-vilagos": "#ff8fab",
    "--szin-kozepes": "#fb6f92",
    "--szin-sotet": "#5c1111",
    "--szin-halvany": "#ffe5ec",
    "--szin-kiemelt": "#f12349",
    "--szinatmenet":
      "linear-gradient(180deg, rgb(255 255 255 / 97%) 0%, rgb(253 129 154 / 94%) 100%)",
    "--szinatmenet-hatter":
      "radial-gradient(circle at center, rgb(222 209 229 / 97%) 90%, rgb(176 160 185 / 94%) 100%)",
    "--szoveg-alap": "#5e4349",
    "--szoveg-alcim": "#603e45",
    "--szoveg-kiemelt": "#680c1f",
    "--betu-dekor": '"Cinzel Decorative", serif',
    "--betu-serif": '"Noto Serif SC", serif',
    "--betu-sans": '"Rajdhani", sans-serif',
    "--betu-mono": '"Share Tech Mono", monospace',
    "--szegely": "1px solid",
  },
  elegans: {
    "--szin-tema-hatter": "#0a0d14",
    "--szin-tema-hatter-eltero": "#111827",
    "--szin-tema-szegely": "#c9a84c",
    "--szin-tema-mely": "#0f1e3a",
    "--szin-tema-kiemelt": "#d4af37",
    "--szin-vilagos": "#e8d48b",
    "--szin-kozepes": "#c9a84c",
    "--szin-sotet": "#050810",
    "--szin-halvany": "#0d1525",
    "--szin-kiemelt": "#f5d060",
    "--szinatmenet":
      "linear-gradient(180deg, rgb(10 13 20 / 98%) 0%, rgb(15 30 58 / 96%) 100%)",
    "--szinatmenet-hatter":
      "radial-gradient(circle at center, rgb(11 15 25 / 98%) 90%, rgb(5 8 16 / 96%) 100%)",
    "--szoveg-alap": "#c8b99a",
    "--szoveg-alcim": "#a89070",
    "--szoveg-kiemelt": "#f5d060",
    "--betu-dekor": '"Cormorant Garamond", serif',
    "--betu-serif": '"Cormorant Garamond", serif',
    "--betu-sans": '"Montserrat", sans-serif',
    "--betu-mono": '"Share Tech Mono", monospace',
    "--szegely": "1px solid",
  },
  termeszet: {
    "--szin-tema-hatter": "#1a2e1e",
    "--szin-tema-hatter-eltero": "#1e3525",
    "--szin-tema-szegely": "#4a8c5c",
    "--szin-tema-mely": "#2d5c3a",
    "--szin-tema-kiemelt": "#3aab5e",
    "--szin-vilagos": "#5bbf7a",
    "--szin-kozepes": "#3aab5e",
    "--szin-sotet": "#0d1a10",
    "--szin-halvany": "#1f3826",
    "--szin-kiemelt": "#6dd48a",
    "--szinatmenet":
      "linear-gradient(180deg, rgb(26 46 30 / 97%) 0%, rgb(45 92 58 / 94%) 100%)",
    "--szinatmenet-hatter":
      "radial-gradient(circle at center, rgb(22 40 28 / 97%) 90%, rgb(14 28 20 / 94%) 100%)",
    "--szoveg-alap": "#a8c9b0",
    "--szoveg-alcim": "#8aad92",
    "--szoveg-kiemelt": "#6dd48a",
    "--betu-dekor": '"Lora", serif',
    "--betu-serif": '"Lora", serif',
    "--betu-sans": '"DM Sans", sans-serif',
    "--betu-mono": '"Share Tech Mono", monospace',
    "--szegely": "1px solid",
  },
  gamer: {
    "--szin-tema-hatter": "#000000",
    "--szin-tema-hatter-eltero": "#0a0000",
    "--szin-tema-szegely": "#cc0000",
    "--szin-tema-mely": "#1a0000",
    "--szin-tema-kiemelt": "#ff1a1a",
    "--szin-vilagos": "#ff4444",
    "--szin-kozepes": "#cc0000",
    "--szin-sotet": "#000000",
    "--szin-halvany": "#120000",
    "--szin-kiemelt": "#ff0000",
    "--szinatmenet":
      "linear-gradient(180deg, rgb(0 0 0 / 97%) 0%, rgb(26 0 0 / 94%) 100%)",
    "--szinatmenet-hatter":
      "radial-gradient(circle at center, rgb(0 0 0 / 97%) 90%, rgb(10 0 0 / 94%) 100%)",
    "--szoveg-alap": "#ff4444",
    "--szoveg-alcim": "#cc2222",
    "--szoveg-kiemelt": "#ff0000",
    "--betu-dekor": '"Orbitron", sans-serif',
    "--betu-serif": '"Orbitron", sans-serif',
    "--betu-sans": '"Orbitron", sans-serif',
    "--betu-mono": '"Share Tech Mono", monospace',
    "--szegely": "1px solid",
  },
};

const TEMA_KULCS = "tema";

export class TemaValaszto {
  #modal;

  constructor() {
    this.#modal = new Modal(
      "tema-modal",
      `
      <h3>Choose Theme</h3>
      <div class="tema-valasztok">
        <div class="tema-kartya" data-tema="girlipop">
          <div class="tema-elonezet tema-girlipop"></div>
          <span>GirliePop</span>
        </div>
        <div class="tema-kartya" data-tema="elegans">
          <div class="tema-elonezet tema-elegans"></div>
          <span>Elegant</span>
        </div>
        <div class="tema-kartya" data-tema="termeszet">
          <div class="tema-elonezet tema-termeszet"></div>
          <span>Nature</span>
        </div>
        <div class="tema-kartya" data-tema="gamer">
          <div class="tema-elonezet tema-gamer"></div>
          <span>Game</span>
        </div>
      </div>
      <div class="modal-gombok">
        <button type="button" id="tema-megse">Cancel</button>
      </div>
    `,
    );

    this.#modal
      .keres("#tema-megse")
      .addEventListener("click", () => this.#modal.bezar());

    this.#modal.keresOsszes(".tema-kartya").forEach((kartya) => {
      kartya.addEventListener("click", () => {
        this.#alkalmazTema(kartya.dataset.tema);
        this.#modal.bezar();
      });
    });

    document.getElementById("beallitasok").addEventListener("click", (e) => {
      e.preventDefault();
      this.#modal.megnyit();
    });

    this.#alkalmazTema(localStorage.getItem(TEMA_KULCS) ?? "girlipop");
  }

  #alkalmazTema(nev) {
    const tema = TEMAK[nev] ?? TEMAK.girlipop;
    Object.entries(tema).forEach(([valtozo, ertek]) => {
      document.documentElement.style.setProperty(valtozo, ertek);
    });
    localStorage.setItem(TEMA_KULCS, nev);
  }
}
