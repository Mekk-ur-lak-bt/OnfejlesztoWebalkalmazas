import { Felhasznalo } from "./Felhasznalo.js";

export class Auth {
  static FELHASZNALOK_KULCS = "felhasznalok";
  static AKTUALIS_FELHASZNALO_KULCS = "aktualisFelhasznaloId";

  static felhasznalokBetolt() {
    const adatok = JSON.parse(localStorage.getItem(Auth.FELHASZNALOK_KULCS)) || [];

    return adatok.map((adat) => Felhasznalo.fromJSON(adat));
  }

  static felhasznalokMent(felhasznalok) {
    localStorage.setItem(
      Auth.FELHASZNALOK_KULCS,
      JSON.stringify(felhasznalok.map((felhasznalo) => felhasznalo.toJSON()))
    );
  }

  static regisztral(nev, avatar = "img/avatar.jpg") {
    const felhasznalok = Auth.felhasznalokBetolt();

    const letezik = felhasznalok.some(
      (felhasznalo) => felhasznalo.nev.toLowerCase() === nev.toLowerCase()
    );

    if (letezik) {
      throw new Error("Ez a felhasználónév már foglalt!");
    }

    const ujFelhasznalo = new Felhasznalo(
      Date.now().toString(),
      nev,
      0,
      0,
      1,
      avatar
    );

    felhasznalok.push(ujFelhasznalo);
    Auth.felhasznalokMent(felhasznalok);

    localStorage.setItem(Auth.AKTUALIS_FELHASZNALO_KULCS, ujFelhasznalo.id);

    return ujFelhasznalo;
  }

  static bejelentkezik(nev) {
    const felhasznalok = Auth.felhasznalokBetolt();

    const felhasznalo = felhasznalok.find(
      (felhasznalo) => felhasznalo.nev.toLowerCase() === nev.toLowerCase()
    );

    if (!felhasznalo) {
      throw new Error("Nincs ilyen felhasználó!");
    }

    localStorage.setItem(Auth.AKTUALIS_FELHASZNALO_KULCS, felhasznalo.id);

    return felhasznalo;
  }

  static kijelentkezik() {
    localStorage.removeItem(Auth.AKTUALIS_FELHASZNALO_KULCS);
  }

  static aktualisFelhasznalo() {
    const aktualisId = localStorage.getItem(Auth.AKTUALIS_FELHASZNALO_KULCS);

    if (!aktualisId) {
      return null;
    }

    const felhasznalok = Auth.felhasznalokBetolt();

    return felhasznalok.find((felhasznalo) => felhasznalo.id === aktualisId) || null;
  }

  static beVanJelentkezve() {
    return Auth.aktualisFelhasznalo() !== null;
  }

  static aktualisFelhasznaloFrissit(felhasznalo) {
    const felhasznalok = Auth.felhasznalokBetolt();

    const index = felhasznalok.findIndex(
      (aktualis) => aktualis.id === felhasznalo.id
    );

    if (index === -1) {
      throw new Error("A felhasználó nem található!");
    }

    felhasznalok[index] = felhasznalo;
    Auth.felhasznalokMent(felhasznalok);
  }
}