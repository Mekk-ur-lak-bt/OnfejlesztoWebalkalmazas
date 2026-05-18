class Feladat {
  constructor(
    id,
    cim,
    kategoria,
    xpJutalom,
    coinJutalom,
    kategoriaPont,
    teljesitve,
    hatarido,
  ) {
    this.id = id;
    this.cim = cim;
    this.kategoria = kategoria;
    this.xpJutalom = xpJutalom;
    this.coinJutalom = coinJutalom;
    this.kategoriaPont = kategoriaPont;
    this.teljesitve = teljesitve;
    this.hatarido = hatarido;
  }

  teljesit() {
    this.teljesitve = true;
    return {
      xp: this.xpJutalom,
      coin: this.coinJutalom,
      kategoria: this.kategoria,
      kategoriaPont: this.kategoriaPont,
    };
  }

  szerkeszt(cim, kategoria, hatarido, kategoriaPont) {
    this.cim = cim;
    this.kategoria = kategoria;
    this.hatarido = hatarido;
    this.kategoriaPont = kategoriaPont;
  }

  torol() {
// Jelenleg a database műveleteket a route-ok kezelik.
  }

  toJSON() {
    return {
      id: this.id,
      cim: this.cim,
      kategoria: this.kategoria,
      xpJutalom: this.xpJutalom,
      coinJutalom: this.coinJutalom,
      kategoriaPont: this.kategoriaPont,
      teljesitve: this.teljesitve,
      hatarido: this.hatarido,
    };
  }

  static letrehoz(
    cim,
    kategoria,
    xpJutalom,
    coinJutalom,
    kategoriaPont,
    hatarido,
  ) {
    return new Feladat(
      null,
      cim,
      kategoria,
      xpJutalom,
      coinJutalom,
      kategoriaPont,
      false,
      hatarido,
    );
  }

  static keres(id) {
// Jelenleg a database műveleteket a route-ok kezelik.
  }

  static osszes(felhasznaloId) {
// Jelenleg a database műveleteket a route-ok kezelik.
  }

  static frissit(id, cim, kategoria, hatarido, kategoriaPont) {
// Jelenleg a database műveleteket a route-ok kezelik.
  }

  static torol(id) {
// Jelenleg a database műveleteket a route-ok kezelik.
  }
}

module.exports = Feladat;
