const db = require("../database");

const SZINT_HATAROK = [0, 100, 250, 1000, 5000, 12000, 25000, 42000, 75000, 120000];

class Felhasznalo {
  static #szintKiszamit(xp) {
    let szint = 1;
    for (let i = 1; i < SZINT_HATAROK.length; i++) {
      if (xp >= SZINT_HATAROK[i]) szint = i;
      else break;
    }
    return szint;
  }

  static szintProgressz(xp) {
    const szint = Felhasznalo.#szintKiszamit(xp);
    const aktualisHatar = SZINT_HATAROK[szint];
    const kovetkezoHatar = SZINT_HATAROK[szint + 1];
    if (!kovetkezoHatar) return 100;
    return Math.floor(((xp - aktualisHatar) / (kovetkezoHatar - aktualisHatar)) * 100);
  }

  static #sorbolObjektum(sor) {
    return {
      id: sor.id,
      nev: sor.nev,
      xp: sor.xp,
      coin: sor.coin,
      szint: sor.szint,
      szintProgressz: Felhasznalo.szintProgressz(sor.xp),
      avatar: sor.avatar,
    };
  }

  static osszes() {
    return db
      .prepare("SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo")
      .all()
      .map(Felhasznalo.#sorbolObjektum);
  }

  static keres(id) {
    const sor = db
      .prepare("SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo WHERE id = ?")
      .get(id);
    return sor ? Felhasznalo.#sorbolObjektum(sor) : null;
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
    const sor = db.prepare("SELECT xp FROM felhasznalo WHERE id = ?").get(id);
    const ujXp = sor.xp + mennyiseg;
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
