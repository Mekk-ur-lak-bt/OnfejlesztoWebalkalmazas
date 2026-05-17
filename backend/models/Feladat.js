class Feladat {
    constructor(id, cim, kategoria, xpJutalom, coinJutalom, kategoriaPont, teljesitve, hatarido) {
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
            kategoriaPont: this.kategoriaPont
        };
    }

    szerkeszt(cim, kategoria, hatarido, kategoriaPont) {
        this.cim = cim;
        this.kategoria = kategoria;
        this.hatarido = hatarido;
        this.kategoriaPont = kategoriaPont;
    }

    torol() {
        //Database bekötés után
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
            hatarido: this.hatarido
        };
    }

    static letrehoz(cim, kategoria, xpJutalom, coinJutalom, kategoriaPont, hatarido) {
        return new Feladat(null, cim, kategoria, xpJutalom, coinJutalom, kategoriaPont, false, hatarido);
    }

    static keres(id) {
        //Database bekötés után
    }

    static osszes(felhasznaloId) {
        //Database bekötés után
    }

    static frissit(id, cim, kategoria, hatarido, kategoriaPont) {
        //Database bekötés után
    }

    static torol(id) {
        //Database bekötés után
    }
}

module.exports = Feladat;