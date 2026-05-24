import { Felhasznalo } from "./Felhasznalo.js";

const API_URL = "http://localhost:3000/api";

export class Auth {
  static AKTUALIS_FELHASZNALO_KULCS = "aktualisFelhasznaloId";

  static async regisztral(nev, jelszo, avatar = "img/avatar.jpg") {
    const valasz = await fetch(`${API_URL}/auth/regisztracio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nev,
        jelszo,
        avatar,
      }),
    });

    const adat = await valasz.json();

    if (!valasz.ok) {
      throw new Error(adat.uzenet || "Sikertelen regisztráció!");
    }

    const felhasznalo = Felhasznalo.fromJSON(adat.felhasznalo);

    localStorage.setItem(Auth.AKTUALIS_FELHASZNALO_KULCS, felhasznalo.id);

    return felhasznalo;
  }

  static async bejelentkezik(nev, jelszo) {
    const valasz = await fetch(`${API_URL}/auth/bejelentkezes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nev,
        jelszo,
      }),
    });

    const adat = await valasz.json();

    if (!valasz.ok) {
      throw new Error(adat.uzenet || "Sikertelen bejelentkezés!");
    }

    const felhasznalo = Felhasznalo.fromJSON(adat.felhasznalo);

    localStorage.setItem(Auth.AKTUALIS_FELHASZNALO_KULCS, felhasznalo.id);

    return felhasznalo;
  }

  static kijelentkezik() {
    localStorage.removeItem(Auth.AKTUALIS_FELHASZNALO_KULCS);
  }

  static aktualisFelhasznaloId() {
    return localStorage.getItem(Auth.AKTUALIS_FELHASZNALO_KULCS);
  }

  static async aktualisFelhasznalo() {
    const aktualisId = Auth.aktualisFelhasznaloId();

    if (!aktualisId) {
      return null;
    }

    const valasz = await fetch(`${API_URL}/felhasznalok/${aktualisId}`);

    const adat = await valasz.json();

    if (!valasz.ok) {
      Auth.kijelentkezik();
      return null;
    }

    return Felhasznalo.fromJSON(adat);
  }

  static beVanJelentkezve() {
    return Auth.aktualisFelhasznaloId() !== null;
  }

  static async aktualisFelhasznaloFrissit() {
    const felhasznalo = await Auth.aktualisFelhasznalo();

    if (!felhasznalo) {
      throw new Error("Nincs bejelentkezett felhasználó!");
    }

    return felhasznalo;
  }
  static async avatarFeltolt(felhasznaloId, fajl) {
    const formData = new FormData();
    formData.append("avatar", fajl);

    const valasz = await fetch(
      `${API_URL}/felhasznalok/${felhasznaloId}/avatar`,
      {
        method: "PATCH",
        body: formData,
      },
    );

    const adat = await valasz.json();

    if (!valasz.ok) {
      throw new Error(adat.uzenet || "Nem sikerült feltölteni a profilképet!");
    }

    return Felhasznalo.fromJSON(adat.felhasznalo);
  }
}
