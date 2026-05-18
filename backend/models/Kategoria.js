class Kategoria {
  constructor(id, nev, pontok) {
    this.id = id;
    this.nev = nev;
    this.pontok = pontok;
  }

  pontotAd(mennyiseg) {
    this.pontok += mennyiseg;
  }
  /*Majd még módosítunk rajta ha meglesz a végleges xp határ*/
  csillagErtek() {
    switch (true) {
      case this.pontok >= 1000:
        return 5;
      case this.pontok >= 500:
        return 4;
      case this.pontok >= 250:
        return 3;
      case this.pontok >= 100:
        return 2;
      default:
        return 1;
    }
  }

  toJSON() {
    return {
      id: this.id,
      nev: this.nev,
      pontok: this.pontok,
    };
  }

  static letrehoz(felhasznaloId, nev) {
// Jelenleg a database műveleteket a route-ok kezelik.
  }

  static keres(id) {
// Jelenleg a database műveleteket a route-ok kezelik.
  }

  static osszes(felhasznaloId) {
// Jelenleg a database műveleteket a route-ok kezelik.
  }

  static pontFrissit(id, mennyiseg) {
// Jelenleg a database műveleteket a route-ok kezelik.
  }
}

module.exports = Kategoria;
