const db = require("../database");
const Felhasznalo = require("./Felhasznalo");
const Kategoria = require("./Kategoria");

class Statisztika {
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
        szintProgressz: Felhasznalo.szintProgressz(felhasznalo.xp),
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
