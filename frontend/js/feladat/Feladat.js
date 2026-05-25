const API = "/api/feladatok";

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

  constructor(id, felhasznaloId, kategoriaId, cim, xpJutalom, coinJutalom, kategoriaPont, teljesitve = false, hatarido = "") {
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

  get id() { return this.#id; }
  get felhasznaloId() { return this.#felhasznaloId; }
  get kategoriaId() { return this.#kategoriaId; }
  get cim() { return this.#cim; }
  get xpJutalom() { return this.#xpJutalom; }
  get coinJutalom() { return this.#coinJutalom; }
  get kategoriaPont() { return this.#kategoriaPont; }
  get teljesitve() { return this.#teljesitve; }
  get hatarido() { return this.#hatarido; }

  async teljesit() {
    const valasz = await fetch(`${API}/${this.#id}/teljesit`, { method: "PATCH" });
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

  async szerkeszt(cim, kategoriaId, hatarido, kategoriaPont, xpJutalom, coinJutalom) {
    const valasz = await fetch(`${API}/${this.#id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kategoriaId: Number(kategoriaId), cim, xpJutalom, coinJutalom, kategoriaPont, hatarido }),
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

  static #sorbolObjektum({ id, felhasznaloId, kategoriaId, cim, xpJutalom, coinJutalom, kategoriaPont, teljesitve, hatarido }) {
    return new Feladat(id, felhasznaloId, kategoriaId, cim, xpJutalom, coinJutalom, kategoriaPont, teljesitve, hatarido);
  }

  static async letrehoz(felhasznaloId, kategoriaId, cim, xpJutalom, coinJutalom, kategoriaPont, hatarido) {
    const valasz = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ felhasznaloId: Number(felhasznaloId), kategoriaId: Number(kategoriaId), cim, xpJutalom, coinJutalom, kategoriaPont, hatarido }),
    });
    if (!valasz.ok) throw new Error("Nem sikerült létrehozni a feladatot!");
    return Feladat.#sorbolObjektum(await valasz.json());
  }

  static async osszes(felhasznaloId = null) {
    const url = felhasznaloId ? `${API}?felhasznaloId=${Number(felhasznaloId)}` : API;
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
