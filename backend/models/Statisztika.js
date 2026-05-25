const db = require("../database");
const Kategoria = require("./Kategoria");

const SZINT_HATAROK = [
  { hatar: 1000, kovetkezo: Infinity },
  { hatar: 500, kovetkezo: 1000 },
  { hatar: 250, kovetkezo: 500 },
  { hatar: 100, kovetkezo: 250 },
  { hatar: 0, kovetkezo: 100 },
];

class Statisztika {
  static #szintProgressz(xp) {
    const szint = SZINT_HATAROK.find((s) => xp >= s.hatar);
    if (szint.kovetkezo === Infinity) return 100;
    return Math.floor(((xp - szint.hatar) / (szint.kovetkezo - szint.hatar)) * 100);
  }

  static osszeallit(felhasznaloId) {
    const felhasznalo = db
      .prepare("SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo WHERE id = ?")
      .get(felhasznaloId);

    if (!felhasznalo) return null;

    const kategoriak = db
      .prepare("SELECT id, nev, pontok FROM kategoria WHERE felhasznalo_id = ?")
      .all(felhasznaloId);

    const { darab: osszes } = db
      .prepare("SELECT COUNT(*) AS darab FROM feladat WHERE felhasznalo_id = ?")
      .get(felhasznaloId);

    const { darab: teljesitett } = db
      .prepare("SELECT COUNT(*) AS darab FROM feladat WHERE felhasznalo_id = ? AND teljesitve = 1")
      .get(felhasznaloId);

    return {
      scoreboard: {
        xp: felhasznalo.xp,
        coin: felhasznalo.coin,
        szint: felhasznalo.szint,
        szintProgressz: Statisztika.#szintProgressz(felhasznalo.xp),
      },
      kategoriak: kategoriak.map((k) => ({
        id: k.id,
        nev: k.nev,
        pontok: k.pontok,
        csillag: Kategoria.csillagErtek(k.pontok),
      })),
      feladatok: { osszes, teljesitett },
    };
  }
}

module.exports = Statisztika;
