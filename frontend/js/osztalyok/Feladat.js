const API = "/api/feladatok";
const KATEGORIA_API = "/api/kategoriak";

export class Feladat {
  #id;
  #felhasznaloId;
  #kategoriaId;
  #cim;
  #xpJutalom;
  #coinJutalom;
  #kategoriaPont;
  #teljesitve;
  #hatarido;

  constructor(
    id,
    felhasznaloId,
    kategoriaId,
    cim,
    xpJutalom,
    coinJutalom,
    kategoriaPont,
    teljesitve = false,
    hatarido = ""
  ) {
    this.#id = id;
    this.#felhasznaloId = felhasznaloId;
    this.#kategoriaId = kategoriaId;
    this.#cim = cim;
    this.#xpJutalom = xpJutalom;
    this.#coinJutalom = coinJutalom;
    this.#kategoriaPont = kategoriaPont;
    this.#teljesitve = teljesitve;
    this.#hatarido = hatarido;
  }

  get id() {
    return this.#id;
  }
  get felhasznaloId() {
    return this.#felhasznaloId;
  }
  get kategoriaId() {
    return this.#kategoriaId;
  }
  get cim() {
    return this.#cim;
  }
  get xpJutalom() {
    return this.#xpJutalom;
  }
  get coinJutalom() {
    return this.#coinJutalom;
  }
  get kategoriaPont() {
    return this.#kategoriaPont;
  }
  get teljesitve() {
    return this.#teljesitve;
  }
  get hatarido() {
    return this.#hatarido;
  }

  async teljesit() {
    const valasz = await fetch(`${API}/${this.#id}/teljesit`, {
      method: "PATCH",
    });
    if (!valasz.ok) throw new Error("Nem sikerült teljesíteni a feladatot!");
    const adat = await valasz.json();
    this.#teljesitve = adat.feladat.teljesitve;
    return adat.jutalom;
  }

  async reset() {
    const valasz = await fetch(`${API}/${this.#id}/reset`, { method: "PATCH" });
    if (!valasz.ok) throw new Error("Nem sikerült visszaállítani a feladatot!");
    this.#teljesitve = false;
  }

  async szerkeszt(
    cim,
    kategoriaId,
    hatarido,
    kategoriaPont,
    xpJutalom,
    coinJutalom
  ) {
    const valasz = await fetch(`${API}/${this.#id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategoriaId: Number(kategoriaId),
        cim,
        xpJutalom,
        coinJutalom,
        kategoriaPont,
        hatarido,
      }),
    });
    if (!valasz.ok) throw new Error("Nem sikerült módosítani a feladatot!");
    const adat = await valasz.json();
    this.#cim = adat.cim;
    this.#kategoriaId = adat.kategoriaId;
    this.#hatarido = adat.hatarido;
    this.#kategoriaPont = adat.kategoriaPont;
    this.#xpJutalom = adat.xpJutalom;
    this.#coinJutalom = adat.coinJutalom;
  }

  toJSON() {
    return {
      id: this.#id,
      felhasznaloId: this.#felhasznaloId,
      kategoriaId: this.#kategoriaId,
      cim: this.#cim,
      xpJutalom: this.#xpJutalom,
      coinJutalom: this.#coinJutalom,
      kategoriaPont: this.#kategoriaPont,
      teljesitve: this.#teljesitve,
      hatarido: this.#hatarido,
    };
  }

  static #sorbolObjektum(adat) {
    return new Feladat(
      adat.id,
      adat.felhasznaloId,
      adat.kategoriaId,
      adat.cim,
      adat.xpJutalom,
      adat.coinJutalom,
      adat.kategoriaPont,
      adat.teljesitve,
      adat.hatarido
    );
  }

  static async letrehoz(
    felhasznaloId,
    kategoriaId,
    cim,
    xpJutalom,
    coinJutalom,
    kategoriaPont,
    hatarido
  ) {
    const valasz = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        felhasznaloId: Number(felhasznaloId),
        kategoriaId: Number(kategoriaId),
        cim,
        xpJutalom,
        coinJutalom,
        kategoriaPont,
        hatarido,
      }),
    });
    if (!valasz.ok) throw new Error("Nem sikerült létrehozni a feladatot!");
    return Feladat.#sorbolObjektum(await valasz.json());
  }

  static async osszes(felhasznaloId = null) {
    const url = felhasznaloId
      ? `${API}?felhasznaloId=${Number(felhasznaloId)}`
      : API;
    const valasz = await fetch(url);
    if (!valasz.ok) throw new Error("Nem sikerült lekérni a feladatokat!");
    return (await valasz.json()).map(Feladat.#sorbolObjektum);
  }

  static async keres(id) {
    const valasz = await fetch(`${API}/${id}`);
    if (!valasz.ok) return null;
    return Feladat.#sorbolObjektum(await valasz.json());
  }

  static async torol(id) {
    const valasz = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!valasz.ok) throw new Error("Nem sikerült törölni a feladatot!");
  }
}

export class FeladatElem {
  #adat;
  #nezet;
  #htmlElem;

  constructor(feladat, nezet) {
    this.#adat = feladat;
    this.#nezet = nezet;
    this.#htmlElem = this.#letrehozElem();
  }

  get htmlElem() {
    return this.#htmlElem;
  }

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
      <p class="feladat-info">${
        kesz ? "COMPLETED" : `+${this.#adat.xpJutalom} XP`
      }</p>
      <div class="akciok"${kesz ? " hidden" : ""}>
        <button class="gomb-szerkeszt" type="button">✏️</button>
        <button class="gomb-torol" type="button">🗑️</button>
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
        li.querySelector(".feladat-info").textContent = this.#adat.teljesitve
          ? "COMPLETED"
          : `+${this.#adat.xpJutalom} XP`;
        li.querySelector(".akciok").hidden = this.#adat.teljesitve;
        window.dispatchEvent(
          new CustomEvent("jutalomvaltozas", { detail: jutalom })
        );
      } catch (e) {
        checkbox.checked = !checkbox.checked;
        console.error(e);
      } finally {
        checkbox.disabled = false;
      }
    });

    li.querySelector(".gomb-szerkeszt").addEventListener("click", () =>
      this.#nezet.szerkeszt(this.#adat)
    );

    li.querySelector(".gomb-torol").addEventListener("click", async () => {
      try {
        await Feladat.torol(this.#adat.id);
        li.remove();
      } catch (e) {
        console.error(e);
      }
    });
  }
}

export class FeladatLista {
  #kontener;
  #felhasznaloId;
  #modal;
  #urlap;
  #rejtettId;
  #kategoriaSelect;

  constructor(szelektor, felhasznaloId = null) {
    this.#kontener = document.querySelector(szelektor);
    this.#felhasznaloId = felhasznaloId ? Number(felhasznaloId) : null;
    this.#modal = document.getElementById("feladat-modal");
    this.#urlap = document.getElementById("feladat-urlap");
    this.#rejtettId = document.getElementById("feladat-id");
    this.#kategoriaSelect = document.getElementById("urlap-kategoria");
    this.#urlapEsemeny();
  }

  felhasznaloIdBeallitas(felhasznaloId) {
    this.#felhasznaloId = felhasznaloId ? Number(felhasznaloId) : null;
  }

  #napiResetSzukseges() {
    const kulcs = `napiReset_${this.#felhasznaloId}`;
    const ma = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(kulcs) === ma) return false;
    localStorage.setItem(kulcs, ma);
    return true;
  }

  async #kategoriaFeltolt() {
    if (!this.#felhasznaloId) return;
    const valasz = await fetch(
      `${KATEGORIA_API}?felhasznaloId=${this.#felhasznaloId}`
    );
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
    this.#urlap.reset();
    if (feladat) {
      document.getElementById("modal-cim").textContent = "Edit Quest";
      this.#rejtettId.value = feladat.id;
      document.getElementById("urlap-cim").value = feladat.cim;
      this.#kategoriaSelect.value = feladat.kategoriaId;
      document.getElementById("urlap-xp").value = feladat.xpJutalom;
      document.getElementById("urlap-coin").value = feladat.coinJutalom;
      document.getElementById("urlap-pont").value = feladat.kategoriaPont;
      document.getElementById("urlap-hatarido").value = feladat.hatarido ?? "";
    } else {
      document.getElementById("modal-cim").textContent = "Add New Quest";
      this.#rejtettId.value = "";
    }
    this.#modal.showModal();
  }

  bezar() {
    this.#modal.close();
  }

  #urlapEsemeny() {
    document
      .getElementById("modal-megse")
      .addEventListener("click", () => this.bezar());

    this.#urlap.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this.#felhasznaloId) return;
      const adatok = {
        id: this.#rejtettId.value,
        cim: document.getElementById("urlap-cim").value.trim(),
        kategoriaId: parseInt(this.#kategoriaSelect.value, 10),
        xp: parseInt(document.getElementById("urlap-xp").value, 10),
        coin: parseInt(document.getElementById("urlap-coin").value, 10),
        pont: parseInt(document.getElementById("urlap-pont").value, 10),
        hatarido: document.getElementById("urlap-hatarido").value,
      };
      try {
        if (adatok.id) {
          const feladat = await Feladat.keres(adatok.id);
          if (feladat)
            await feladat.szerkeszt(
              adatok.cim,
              adatok.kategoriaId,
              adatok.hatarido,
              adatok.pont,
              adatok.xp,
              adatok.coin
            );
        } else {
          await Feladat.letrehoz(
            this.#felhasznaloId,
            adatok.kategoriaId,
            adatok.cim,
            adatok.xp,
            adatok.coin,
            adatok.pont,
            adatok.hatarido
          );
        }
        this.bezar();
        await this.frissit();
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
      await Promise.all(
        feladatok.filter((f) => f.teljesitve).map((f) => f.reset())
      );
    }
    feladatok.forEach((f) => {
      const elem = new FeladatElem(f, {
        szerkeszt: (feladat) => this.megnyit(feladat),
      });
      this.#kontener.appendChild(elem.htmlElem);
    });
  }
}
