class Felhasznalo {
  constructor(id, nev, xp, coin, szint, avatar) {
    this.id = id;
    this.nev = nev;
    this.xp = xp;
    this.coin = coin;
    this.szint = szint;
    this.avatar = avatar;
  }

  xpHozzaad(mennyiseg) {
    this.xp += mennyiseg;
    this.szint = this.szintKiszamit();
  }

  coinHozzaad(mennyiseg) {
    this.coin += mennyiseg;
  }

  szintKiszamit() {
    switch (true) {
      case this.xp >= 1000:
        return 5;
      case this.xp >= 500:
        return 4;
      case this.xp >= 250:
        return 3;
      case this.xp >= 100:
        return 2;
      default:
        return 1;
    }
  }
  /*Majd még módosítunk rajta ha meglesz a végleges xp határ*/
  szintProgressz() {
    return this.xp % 100;
  }

  toJSON() {
    return {
      id: this.id,
      nev: this.nev,
      xp: this.xp,
      coin: this.coin,
      szint: this.szint,
      avatar: this.avatar,
    };
  }

  static letrehoz(nev, avatar) {
    return new Felhasznalo(null, nev, 0, 0, 1, avatar);
  }
}

module.exports = Felhasznalo;
