import { Modal } from "../ui/Modal.js";

const ERVENYES_TEMAK = ["girlipop", "elegans", "termeszet", "gamer"];
const TEMA_KULCS = "tema";

export class Temavalaszto {
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
    const ervenyesNev = ERVENYES_TEMAK.includes(nev) ? nev : "girlipop";

    ERVENYES_TEMAK.forEach((tema) => {
      document.documentElement.classList.remove(`tema-${tema}`);
    });

    document.documentElement.classList.add(`tema-${ervenyesNev}`);
    localStorage.setItem(TEMA_KULCS, ervenyesNev);
  }
}
