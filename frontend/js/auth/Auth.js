import { Felhasznalo } from "../osztalyok/Felhasznalo.js";

export class Auth {
  static #KULCS = "aktualisFelhasznaloId";

  static async regisztral(nev, jelszo) {
    const valasz = await fetch("/api/auth/regisztracio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nev, jelszo }),
    });
    const adat = await valasz.json();
    if (!valasz.ok) throw new Error(adat.uzenet || "Sikertelen regisztráció!");
    localStorage.setItem(Auth.#KULCS, adat.felhasznalo.id);
    return Felhasznalo.fromJSON(adat.felhasznalo);
  }

  static async bejelentkezik(nev, jelszo) {
    const valasz = await fetch("/api/auth/bejelentkezes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nev, jelszo }),
    });
    const adat = await valasz.json();
    if (!valasz.ok) throw new Error(adat.uzenet || "Sikertelen bejelentkezés!");
    localStorage.setItem(Auth.#KULCS, adat.felhasznalo.id);
    return Felhasznalo.fromJSON(adat.felhasznalo);
  }

  static kijelentkezik() {
    localStorage.removeItem(Auth.#KULCS);
  }

  static aktualisFelhasznaloId() {
    return localStorage.getItem(Auth.#KULCS);
  }

  static async aktualisFelhasznalo() {
    const id = Auth.aktualisFelhasznaloId();
    if (!id) return null;
    const valasz = await fetch(`/api/felhasznalok/${id}`);
    if (!valasz.ok) {
      Auth.kijelentkezik();
      return null;
    }
    return Felhasznalo.fromJSON(await valasz.json());
  }

  static beVanJelentkezve() {
    return Auth.aktualisFelhasznaloId() !== null;
  }

  static async avatarFeltolt(felhasznaloId, fajl) {
    const formData = new FormData();
    formData.append("avatar", fajl);
    const valasz = await fetch(`/api/felhasznalok/${felhasznaloId}/avatar`, {
      method: "PATCH",
      body: formData,
    });
    const adat = await valasz.json();
    if (!valasz.ok)
      throw new Error(adat.uzenet || "Nem sikerült feltölteni a profilképet!");
    return Felhasznalo.fromJSON(adat.felhasznalo);
  }
}
