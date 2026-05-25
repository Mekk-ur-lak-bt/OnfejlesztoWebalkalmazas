import { Feladat } from "./Feladat.js";
import { FeladatElem } from "./FeladatElem.js";
import { Modal } from "../ui/Modal.js";

const KATEGORIA_API = "/api/kategoriak";

function maiDatum() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export class FeladatLista {
  #kontener;
  #felhasznaloId;
  #modal;
  #kategoriaSelect;

  constructor(szelektor, felhasznaloId = null) {
    this.#kontener = document.querySelector(szelektor);
    this.#felhasznaloId = felhasznaloId ? Number(felhasznaloId) : null;
    this.#modal = new Modal(
      "feladat-modal",
      `
      <form id="feladat-urlap">
        <h3 id="modal-cim">Add New Quest</h3>
        <input type="hidden" id="feladat-id" />
        <label for="urlap-cim">Quest Title:</label>
        <input type="text" id="urlap-cim" required />
        <label for="urlap-kategoria">Category:</label>
        <select id="urlap-kategoria" required></select>
        <label for="urlap-xp">XP Reward:</label>
        <input type="number" id="urlap-xp" min="0" required />
        <label for="urlap-coin">Coin Reward:</label>
        <input type="number" id="urlap-coin" min="0" required />
        <label for="urlap-pont">Category Points:</label>
        <input type="number" id="urlap-pont" min="0" required />
        <label for="urlap-hatarido">Deadline:</label>
        <input type="date" id="urlap-hatarido" />
        <div class="modal-gombok">
          <button type="button" id="modal-megse">Cancel</button>
          <button type="submit" id="modal-mentes">Save</button>
        </div>
      </form>
    `,
    );
    this.#kategoriaSelect = this.#modal.keres("#urlap-kategoria");
    this.#urlapEsemeny();
  }

  felhasznaloIdBeallitas(felhasznaloId) {
    this.#felhasznaloId = felhasznaloId ? Number(felhasznaloId) : null;
  }

  #feladatValtozastKiald() {
    window.dispatchEvent(new CustomEvent("feladatValtozas"));
  }

  #napiResetSzukseges() {
    const kulcs = `napiReset_${this.#felhasznaloId}`;
    const ma = maiDatum();
    if (localStorage.getItem(kulcs) === ma) return false;
    localStorage.setItem(kulcs, ma);
    return true;
  }

  async #kategoriaFeltolt() {
    if (!this.#felhasznaloId) return;
    const valasz = await fetch(`${KATEGORIA_API}?felhasznaloId=${this.#felhasznaloId}`);
    if (!valasz.ok) return;
    const kategoriak = await valasz.json();
    this.#kategoriaSelect.innerHTML = "";
    kategoriak.forEach((k) => {
      const option = document.createElement("option");
      option.value = k.id;
      option.textContent = k.nev;
      this.#kategoriaSelect.appendChild(option);
    });
  }

  async megnyit(feladat = null) {
    await this.#kategoriaFeltolt();
    this.#modal.urlap.reset();
    const modalCim = this.#modal.keres("#modal-cim");
    const rejtettId = this.#modal.keres("#feladat-id");
    if (feladat) {
      modalCim.textContent = "Edit Quest";
      rejtettId.value = feladat.id;
      this.#modal.keres("#urlap-cim").value = feladat.cim;
      this.#kategoriaSelect.value = feladat.kategoriaId;
      this.#modal.keres("#urlap-xp").value = feladat.xpJutalom;
      this.#modal.keres("#urlap-coin").value = feladat.coinJutalom;
      this.#modal.keres("#urlap-pont").value = feladat.kategoriaPont;
      this.#modal.keres("#urlap-hatarido").value = feladat.hatarido ?? "";
    } else {
      modalCim.textContent = "Add New Quest";
      rejtettId.value = "";
    }
    this.#modal.megnyit();
  }

  bezar() {
    this.#modal.bezar();
  }

  #urlapEsemeny() {
    this.#modal.keres("#modal-megse").addEventListener("click", () => this.bezar());
    this.#modal.urlap.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this.#felhasznaloId) return;
      const adatok = {
        id: this.#modal.keres("#feladat-id").value,
        cim: this.#modal.keres("#urlap-cim").value.trim(),
        kategoriaId: parseInt(this.#kategoriaSelect.value, 10),
        xp: parseInt(this.#modal.keres("#urlap-xp").value, 10),
        coin: parseInt(this.#modal.keres("#urlap-coin").value, 10),
        pont: parseInt(this.#modal.keres("#urlap-pont").value, 10),
        hatarido: this.#modal.keres("#urlap-hatarido").value,
      };
      try {
        if (adatok.id) {
          const feladat = await Feladat.keres(adatok.id);
          if (feladat) await feladat.szerkeszt(adatok.cim, adatok.kategoriaId, adatok.hatarido, adatok.pont, adatok.xp, adatok.coin);
        } else {
          await Feladat.letrehoz(this.#felhasznaloId, adatok.kategoriaId, adatok.cim, adatok.xp, adatok.coin, adatok.pont, adatok.hatarido);
        }
        this.bezar();
        await this.frissit();
        this.#feladatValtozastKiald();
      } catch (e) {
        console.error("Mentés sikertelen:", e);
      }
    });
  }

  async frissit() {
    this.#kontener.innerHTML = "";
    if (!this.#felhasznaloId) return;
    const feladatok = await Feladat.osszes(this.#felhasznaloId);
    if (this.#napiResetSzukseges()) {
      await Promise.all(feladatok.filter((f) => f.teljesitve).map((f) => f.reset()));
    }
    feladatok.forEach((f) => {
      const elem = new FeladatElem(f, { szerkeszt: (feladat) => this.megnyit(feladat) });
      this.#kontener.appendChild(elem.htmlElem);
    });
  }
}
