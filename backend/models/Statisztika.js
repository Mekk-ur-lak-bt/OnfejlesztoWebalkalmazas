class Statisztika {
  constructor(felhasznalo, kategoriak) {
    this.felhasznalo = felhasznalo;
    this.kategoriak = kategoriak;
  }

  getScoreboard() {
    return {
      xp: this.felhasznalo.xp,
      coin: this.felhasznalo.coin,
      szint: this.felhasznalo.szint,
      szintProgressz: this.felhasznalo.szintProgressz(),
    };
  }

  getKategoriaChart() {
    const eredmeny = [];
    for (let i = 0; i < this.kategoriak.length; i++) {
      eredmeny.push({
        nev: this.kategoriak[i].nev,
        csillag: this.kategoriak[i].csillagErtek(),
      });
    }
    return eredmeny;
  }

  static osszeallit(felhasznaloId) {
    //Database bekötés után
  }
}

module.exports = Statisztika;
