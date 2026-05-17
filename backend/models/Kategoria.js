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
    //Database bekötés után
  }

  static keres(id) {
    //Database bekötés után
  }

  static osszes(felhasznaloId) {
    //Database bekötés után
  }

  static pontFrissit(id, mennyiseg) {
    //Database bekötés után
  }
}

module.exports = Kategoria;
