export class Felhasznalo {
  #id;
  #nev;
  #xp;
  #coin;
  #szint;
  #szintProgressz;
  #avatar;

  constructor(id, nev, xp = 0, coin = 0, szint = 1, szintProgressz = 0, avatar = "") {
    this.#id = id;
    this.#nev = nev;
    this.#xp = xp;
    this.#coin = coin;
    this.#szint = szint;
    this.#szintProgressz = szintProgressz;
    this.#avatar = avatar;
  }

  get id() { return this.#id; }
  get nev() { return this.#nev; }
  get xp() { return this.#xp; }
  get coin() { return this.#coin; }
  get szint() { return this.#szint; }
  get szintProgressz() { return this.#szintProgressz; }
  get avatar() { return this.#avatar; }

  toJSON() {
    return {
      id: this.#id,
      nev: this.#nev,
      xp: this.#xp,
      coin: this.#coin,
      szint: this.#szint,
      szintProgressz: this.#szintProgressz,
      avatar: this.#avatar,
    };
  }

  static fromJSON({ id, nev, xp, coin, szint, szintProgressz, avatar }) {
    return new Felhasznalo(id, nev, xp, coin, szint, szintProgressz, avatar);
  }
}
