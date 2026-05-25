const SZINT_HATAROK = [0, 100, 250, 500, 1000];

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

  get id() { return this.#id; }
  get nev() { return this.#nev; }
  get xp() { return this.#xp; }
  get coin() { return this.#coin; }
  get szint() { return this.#szint; }
  get avatar() { return this.#avatar; }

  szintProgressz() {
    const aktualisHatar = SZINT_HATAROK[this.#szint - 1];
    const kovetkezoHatar = SZINT_HATAROK[this.#szint] ?? this.#xp;
    if (kovetkezoHatar === aktualisHatar) return 100;
    return Math.floor(((this.#xp - aktualisHatar) / (kovetkezoHatar - aktualisHatar)) * 100);
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

  static fromJSON({ id, nev, xp, coin, szint, avatar }) {
    return new Felhasznalo(id, nev, xp, coin, szint, avatar);
  }
}
