const db = require("../database");

class Kategoria {
  static #sorbolObjektum(sor) {
    return {
      id: sor.id,
      felhasznaloId: sor.felhasznalo_id,
      nev: sor.nev,
      pontok: sor.pontok,
    };
  }

  static csillagErtek(pontok) {
    const hatarok = [1000, 500, 250, 100];
    const index = hatarok.findIndex((h) => pontok >= h);
    return index === -1 ? 1 : 5 - index;
  }

  static osszes(felhasznaloId = null) {
    const sorok = felhasznaloId
      ? db.prepare("SELECT id, felhasznalo_id, nev, pontok FROM kategoria WHERE felhasznalo_id = ?").all(Number(felhasznaloId))
      : db.prepare("SELECT id, felhasznalo_id, nev, pontok FROM kategoria").all();
    return sorok.map(Kategoria.#sorbolObjektum);
  }

  static keres(id) {
    const sor = db.prepare("SELECT id, felhasznalo_id, nev, pontok FROM kategoria WHERE id = ?").get(Number(id));
    return sor ? Kategoria.#sorbolObjektum(sor) : null;
  }

  static felhasznaloLetezik(felhasznaloId) {
    return !!db.prepare("SELECT id FROM felhasznalo WHERE id = ?").get(Number(felhasznaloId));
  }

  static letrehoz(felhasznaloId, nev) {
    const eredmeny = db
      .prepare("INSERT INTO kategoria (felhasznalo_id, nev, pontok) VALUES (?, ?, 0)")
      .run(Number(felhasznaloId), nev);
    return Kategoria.keres(eredmeny.lastInsertRowid);
  }

  static atnevez(id, nev) {
    db.prepare("UPDATE kategoria SET nev = ? WHERE id = ?").run(nev, Number(id));
    return Kategoria.keres(id);
  }

  static pontFrissit(id, mennyiseg) {
    db.prepare("UPDATE kategoria SET pontok = pontok + ? WHERE id = ?").run(mennyiseg, Number(id));
    return Kategoria.keres(id);
  }

  static torol(id) {
    db.prepare("DELETE FROM kategoria WHERE id = ?").run(Number(id));
  }
}

module.exports = Kategoria;
