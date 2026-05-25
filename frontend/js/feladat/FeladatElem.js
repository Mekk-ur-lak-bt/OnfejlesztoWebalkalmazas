import { Feladat } from "./Feladat.js";

export class FeladatElem {
  #adat;
  #nezet;
  #htmlElem;

  constructor(feladat, nezet) {
    this.#adat = feladat;
    this.#nezet = nezet;
    this.#htmlElem = this.#letrehozElem();
  }

  get htmlElem() { return this.#htmlElem; }

  #letrehozElem() {
    const kesz = this.#adat.teljesitve;
    const li = document.createElement("li");
    li.className = `feladat${kesz ? " kesz" : ""}`;
    li.dataset.id = this.#adat.id;
    li.innerHTML = `
      <label>
        <input type="checkbox" ${kesz ? "checked" : ""} />
        <span>${this.#adat.cim}</span>
      </label>
      <p class="feladat-info">${kesz ? "COMPLETED" : `+${this.#adat.xpJutalom} XP`}</p>
      <div class="akciok"${kesz ? " hidden" : ""}>
        <button class="gomb-szerkeszt" type="button"><span class="material-symbols-outlined">edit</span></button>
        <button class="gomb-torol" type="button"><span class="material-symbols-outlined">delete</span></button>
      </div>
    `;
    this.#esemenyek(li);
    return li;
  }

  #esemenyek(li) {
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", async () => {
      checkbox.disabled = true;
      try {
        const jutalom = await this.#adat.teljesit();
        li.className = `feladat${this.#adat.teljesitve ? " kesz" : ""}`;
        li.querySelector(".feladat-info").textContent = this.#adat.teljesitve ? "COMPLETED" : `+${this.#adat.xpJutalom} XP`;
        li.querySelector(".akciok").hidden = this.#adat.teljesitve;
        window.dispatchEvent(new CustomEvent("jutalomvaltozas", { detail: jutalom }));
      } catch (e) {
        checkbox.checked = !checkbox.checked;
        console.error(e);
      } finally {
        checkbox.disabled = false;
      }
    });
    li.querySelector(".gomb-szerkeszt").addEventListener("click", () => this.#nezet.szerkeszt(this.#adat));
    li.querySelector(".gomb-torol").addEventListener("click", async () => {
      try {
        await Feladat.torol(this.#adat.id);
        window.dispatchEvent(new CustomEvent("feladatValtozas"));
        li.remove();
      } catch (e) {
        console.error(e);
      }
    });
  }
}
