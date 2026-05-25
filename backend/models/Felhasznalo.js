const db = require("../database");

const SZINT_HATAROK = [1000, 500, 250, 100];

class Felhasznalo {
  static #szintKiszamit(xp) {
    const index = SZINT_HATAROK.findIndex((h) => xp >= h);
    return index === -1 ? 1 : 5 - index;
  }

  static #sorbolObjektum(sor) {
    return {
      id: sor.id,
      nev: sor.nev,
      xp: sor.xp,
      coin: sor.coin,
      szint: sor.szint,
      avatar: sor.avatar,
    };
  }

  static osszes() {
    return db
      .prepare("SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo")
      .all();
  }

  static keres(id) {
    return db
      .prepare("SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo WHERE id = ?")
      .get(id);
  }

  static keresByNev(nev) {
    return db.prepare("SELECT * FROM felhasznalo WHERE nev = ?").get(nev);
  }

  static letrehoz(nev, jelszo, avatar = "img/avatar.jpg") {
    const eredmeny = db
      .prepare("INSERT INTO felhasznalo (nev, jelszo, xp, coin, szint, avatar) VALUES (?, ?, 0, 0, 1, ?)")
      .run(nev, jelszo, avatar);
    return Felhasznalo.keres(eredmeny.lastInsertRowid);
  }

  static avatarFrissit(id, avatarUtvonal) {
    db.prepare("UPDATE felhasznalo SET avatar = ? WHERE id = ?").run(avatarUtvonal, id);
    return Felhasznalo.keres(id);
  }

  static xpHozzaad(id, mennyiseg) {
    const felhasznalo = db.prepare("SELECT xp FROM felhasznalo WHERE id = ?").get(id);
    const ujXp = felhasznalo.xp + mennyiseg;
    const ujSzint = Felhasznalo.#szintKiszamit(ujXp);
    db.prepare("UPDATE felhasznalo SET xp = ?, szint = ? WHERE id = ?").run(ujXp, ujSzint, id);
    return Felhasznalo.keres(id);
  }

  static coinHozzaad(id, mennyiseg) {
    db.prepare("UPDATE felhasznalo SET coin = coin + ? WHERE id = ?").run(mennyiseg, id);
    return Felhasznalo.keres(id);
  }

  static sorbolObjektum(sor) {
    return Felhasznalo.#sorbolObjektum(sor);
  }
}

module.exports = Felhasznalo;
