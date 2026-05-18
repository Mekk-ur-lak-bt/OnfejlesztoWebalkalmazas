export class Felhasznalo {
  #id;
  #nev;
  #xp;
  #coin;
  #szint;
  #avatar;

  constructor(id, nev, xp = 0, coin = 0, szint = 1, avatar = "") {
    this.#id = id;
    this.#nev = nev;
    this.#xp = xp;
    this.#coin = coin;
    this.#szint = szint;
    this.#avatar = avatar;
  }

  get id() {
    return this.#id;
  }

  get nev() {
    return this.#nev;
  }

  get xp() {
    return this.#xp;
  }

  get coin() {
    return this.#coin;
  }

  get szint() {
    return this.#szint;
  }

  get avatar() {
    return this.#avatar;
  }

  xpHozzaad(mennyiseg) {
    this.#xp += mennyiseg;
    this.#szint = this.szintKiszamit();
  }

  coinHozzaad(mennyiseg) {
    this.#coin += mennyiseg;
  }

  szintKiszamit() {
    switch (true) {
      case this.#xp >= 1000:
        return 5;
      case this.#xp >= 500:
        return 4;
      case this.#xp >= 250:
        return 3;
      case this.#xp >= 100:
        return 2;
      default:
        return 1;
    }
  }

  szintProgressz() {
    return this.#xp % 100;
  }

  toJSON() {
    return {
      id: this.#id,
      nev: this.#nev,
      xp: this.#xp,
      coin: this.#coin,
      szint: this.#szint,
      avatar: this.#avatar,
    };
  }

  static fromJSON(adat) {
    return new Felhasznalo(
      adat.id,
      adat.nev,
      adat.xp,
      adat.coin,
      adat.szint,
      adat.avatar
    );
  }
}