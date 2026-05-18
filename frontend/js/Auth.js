import { Felhasznalo } from "./Felhasznalo.js";

export class Auth {
  static FELHASZNALOK_KULCS = "felhasznalok";
  static AKTUALIS_FELHASZNALO_KULCS = "aktualisFelhasznaloId";

  static felhasznalokBetolt() {
    const adatok =
      JSON.parse(localStorage.getItem(Auth.FELHASZNALOK_KULCS)) || [];

    return adatok.map((adat) => Felhasznalo.fromJSON(adat));
  }

  static felhasznalokMent(felhasznalok) {
    localStorage.setItem(
      Auth.FELHASZNALOK_KULCS,
      JSON.stringify(felhasznalok.map((felhasznalo) => felhasznalo.toJSON())),
    );
  }

  static regisztral(nev, jelszo, avatar = "img/avatar.jpg") {
    const felhasznalok = Auth.felhasznalokBetolt();

    const letezik = felhasznalok.some(
      (felhasznalo) => felhasznalo.nev.toLowerCase() === nev.toLowerCase(),
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
      avatar,
    );

    const mentendo = ujFelhasznalo.toJSON();
    mentendo.jelszo = jelszo;

    const nyersAdatok =
      JSON.parse(localStorage.getItem(Auth.FELHASZNALOK_KULCS)) || [];
    nyersAdatok.push(mentendo);

    localStorage.setItem(Auth.FELHASZNALOK_KULCS, JSON.stringify(nyersAdatok));
    localStorage.setItem(Auth.AKTUALIS_FELHASZNALO_KULCS, ujFelhasznalo.id);

    return ujFelhasznalo;
  }

  static bejelentkezik(nev, jelszo) {
    const adatok =
      JSON.parse(localStorage.getItem(Auth.FELHASZNALOK_KULCS)) || [];

    const adat = adatok.find(
      (felhasznalo) =>
        felhasznalo.nev.toLowerCase() === nev.toLowerCase() &&
        felhasznalo.jelszo === jelszo,
    );

    if (!adat) {
      throw new Error("Hibás felhasználónév vagy jelszó!");
    }

    localStorage.setItem(Auth.AKTUALIS_FELHASZNALO_KULCS, adat.id);

    return Felhasznalo.fromJSON(adat);
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

    return (
      felhasznalok.find((felhasznalo) => felhasznalo.id === aktualisId) || null
    );
  }

  static beVanJelentkezve() {
    return Auth.aktualisFelhasznalo() !== null;
  }

  static aktualisFelhasznaloFrissit(felhasznalo) {
    const felhasznalok = Auth.felhasznalokBetolt();

    const index = felhasznalok.findIndex(
      (aktualis) => aktualis.id === felhasznalo.id,
    );

    if (index === -1) {
      throw new Error("A felhasználó nem található!");
    }

    felhasznalok[index] = felhasznalo;
    Auth.felhasznalokMent(felhasznalok);
  }
}
