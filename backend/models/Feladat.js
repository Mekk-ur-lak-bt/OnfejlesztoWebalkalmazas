const db = require("../database");
const Felhasznalo = require("./Felhasznalo");

class Feladat {
  static #sorbolObjektum(sor) {
    return {
      id: sor.id,
      felhasznaloId: sor.felhasznalo_id,
      kategoriaId: sor.kategoria_id,
      cim: sor.cim,
      xpJutalom: sor.xp_jutalom,
      coinJutalom: sor.coin_jutalom,
      kategoriaPont: sor.kategoria_pont,
      teljesitve: Boolean(sor.teljesitve),
      hatarido: sor.hatarido,
    };
  }

  static osszes(felhasznaloId = null) {
    const sorok = felhasznaloId
      ? db.prepare("SELECT * FROM feladat WHERE felhasznalo_id = ?").all(Number(felhasznaloId))
      : db.prepare("SELECT * FROM feladat").all();
    return sorok.map(Feladat.#sorbolObjektum);
  }

  static keres(id) {
    const sor = db.prepare("SELECT * FROM feladat WHERE id = ?").get(Number(id));
    return sor ? Feladat.#sorbolObjektum(sor) : null;
  }

  static felhasznaloLetezik(felhasznaloId) {
    return !!db.prepare("SELECT id FROM felhasznalo WHERE id = ?").get(Number(felhasznaloId));
  }

  static kategoriaLetezik(kategoriaId, felhasznaloId) {
    return !!db
      .prepare("SELECT id FROM kategoria WHERE id = ? AND felhasznalo_id = ?")
      .get(Number(kategoriaId), Number(felhasznaloId));
  }

  static letrehoz({ felhasznaloId, kategoriaId, cim, xpJutalom = 0, coinJutalom = 0, kategoriaPont = 0, hatarido = null }) {
    const eredmeny = db
      .prepare("INSERT INTO feladat (felhasznalo_id, kategoria_id, cim, xp_jutalom, coin_jutalom, kategoria_pont, teljesitve, hatarido) VALUES (?, ?, ?, ?, ?, ?, 0, ?)")
      .run(Number(felhasznaloId), Number(kategoriaId), cim, xpJutalom, coinJutalom, kategoriaPont, hatarido);
    return Feladat.keres(eredmeny.lastInsertRowid);
  }

  static szerkeszt(id, { kategoriaId, cim, xpJutalom, coinJutalom, kategoriaPont, hatarido }) {
    const letezo = db.prepare("SELECT * FROM feladat WHERE id = ?").get(Number(id));
    db.prepare("UPDATE feladat SET kategoria_id = ?, cim = ?, xp_jutalom = ?, coin_jutalom = ?, kategoria_pont = ?, hatarido = ? WHERE id = ?")
      .run(
        Number(kategoriaId ?? letezo.kategoria_id),
        cim ?? letezo.cim,
        xpJutalom ?? letezo.xp_jutalom,
        coinJutalom ?? letezo.coin_jutalom,
        kategoriaPont ?? letezo.kategoria_pont,
        hatarido ?? letezo.hatarido,
        Number(id)
      );
    return Feladat.keres(id);
  }

  static teljesit(id) {
    const feladat = db.prepare("SELECT * FROM feladat WHERE id = ?").get(Number(id));
    const ujTeljesitve = feladat.teljesitve ? 0 : 1;
    const szorzo = ujTeljesitve ? 1 : -1;

    db.prepare("UPDATE feladat SET teljesitve = ? WHERE id = ?").run(ujTeljesitve, Number(id));

    const frissitettFelhasznalo = Felhasznalo.xpHozzaad(feladat.felhasznalo_id, feladat.xp_jutalom * szorzo);

    db.prepare("UPDATE felhasznalo SET coin = coin + ? WHERE id = ?")
      .run(feladat.coin_jutalom * szorzo, feladat.felhasznalo_id);

    db.prepare("UPDATE kategoria SET pontok = pontok + ? WHERE id = ?")
      .run(feladat.kategoria_pont * szorzo, feladat.kategoria_id);

    return {
      feladat: Feladat.keres(id),
      felhasznalo: frissitettFelhasznalo,
      jutalom: {
        xp: feladat.xp_jutalom * szorzo,
        coin: feladat.coin_jutalom * szorzo,
        kategoriaId: feladat.kategoria_id,
        kategoriaPont: feladat.kategoria_pont * szorzo,
      },
    };
  }

  static reset(id) {
    db.prepare("UPDATE feladat SET teljesitve = 0 WHERE id = ?").run(Number(id));
    return Feladat.keres(id);
  }

  static torol(id) {
    db.prepare("DELETE FROM feladat WHERE id = ?").run(Number(id));
  }
}

module.exports = Feladat;
