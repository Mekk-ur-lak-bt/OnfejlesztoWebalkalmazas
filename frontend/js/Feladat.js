export class Feladat {
  #id; #cim; #kategoria; #xpJutalom; #coinJutalom; #kategoriaPont; #teljesitve; #hatarido;

  constructor(id, cim, kategoria, xpJutalom, coinJutalom, kategoriaPont, teljesitve = false, hatarido = '') {
    this.#id = id;
    this.#cim = cim;
    this.#kategoria = kategoria;
    this.#xpJutalom = xpJutalom;
    this.#coinJutalom = coinJutalom;
    this.#kategoriaPont = kategoriaPont;
    this.#teljesitve = teljesitve;
    this.#hatarido = hatarido;
  }

  get id() { return this.#id; }
  get cim() { return this.#cim; }
  get kategoria() { return this.#kategoria; }
  get xpJutalom() { return this.#xpJutalom; }
  get coinJutalom() { return this.#coinJutalom; }
  get kategoriaPont() { return this.#kategoriaPont; }
  get teljesitve() { return this.#teljesitve; }
  get hatarido() { return this.#hatarido; }

  teljesit() {
    this.#teljesitve = !this.#teljesitve;
    Feladat.frissit(this);
    const szorzo = this.#teljesitve ? 1 : -1;
    return {
      xp: this.#xpJutalom * szorzo,
      coin: this.#coinJutalom * szorzo,
      kategoria: this.#kategoria,
      pont: this.#kategoriaPont * szorzo
    };
  }

  szerkeszt(cim, kategoria, hatarido, kategoriaPont, xpJutalom, coinJutalom) {
    this.#cim = cim;
    this.#kategoria = kategoria;
    this.#hatarido = hatarido;
    this.#kategoriaPont = kategoriaPont;
    this.#xpJutalom = xpJutalom;
    this.#coinJutalom = coinJutalom;
    Feladat.frissit(this);
  }

  toJSON() {
    return {
      id: this.#id,
      cim: this.#cim,
      kategoria: this.#kategoria,
      xpJutalom: this.#xpJutalom,
      coinJutalom: this.#coinJutalom,
      kategoriaPont: this.#kategoriaPont,
      teljesitve: this.#teljesitve,
      hatarido: this.#hatarido
    };
  }

  static letrehoz(cim, kategoria, xpJutalom, coinJutalom, kategoriaPont, hatarido) {
    const uj = new Feladat(Date.now().toString(), cim, kategoria, xpJutalom, coinJutalom, kategoriaPont, false, hatarido);
    const lista = Feladat.osszes();
    lista.push(uj);
    localStorage.setItem('feladatok', JSON.stringify(lista.map(f => f.toJSON())));
    return uj;
  }

  static osszes() {
    return (JSON.parse(localStorage.getItem('feladatok')) || []).map(f =>
      new Feladat(f.id, f.cim, f.kategoria, f.xpJutalom, f.coinJutalom, f.kategoriaPont, f.teljesitve, f.hatarido)
    );
  }

  static frissit(modositott) {
    const lista = Feladat.osszes();
    const index = lista.findIndex(f => f.id === modositott.id);
    if (index !== -1) {
      lista[index] = modositott;
      localStorage.setItem('feladatok', JSON.stringify(lista.map(f => f.toJSON())));
    }
  }

  static torol(id) {
    const szurt = Feladat.osszes().filter(f => f.id !== id);
    localStorage.setItem('feladatok', JSON.stringify(szurt.map(f => f.toJSON())));
  }

  static keres(id) {
    return Feladat.osszes().find(f => f.id === id) || null;
  }
}

export class FeladatElem {
  #adat; #nezet; #htmlElem;

  constructor(feladat, nezet) {
    this.#adat = feladat;
    this.#nezet = nezet;
    this.#htmlElem = this.#letrehozElem();
  }

  get htmlElem() { return this.#htmlElem; }

  #letrehozElem() {
    const li = document.createElement('li');
    li.className = `feladat${this.#adat.teljesitve ? ' kesz' : ''}`;
    li.dataset.id = this.#adat.id;
    li.innerHTML = `
      <label>
        <input type="checkbox" ${this.#adat.teljesitve ? 'checked' : ''} />
        <span>${this.#adat.cim}</span>
      </label>
      <p class="feladat-info">${this.#adat.teljesitve ? 'COMPLETED' : `Skill: ${this.#adat.kategoria} • +${this.#adat.xpJutalom} XP`}</p>
      <div class="akciok">
        <button class="gomb-szerkeszt" type="button">✏️</button>
        <button class="gomb-torol" type="button">🗑️</button>
      </div>
    `;
    this.#esemenyek(li);
    return li;
  }

  #esemenyek(li) {
    li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
      const jutalom = this.#adat.teljesit();
      li.className = `feladat${this.#adat.teljesitve ? ' kesz' : ''}`;
      li.querySelector('.feladat-info').textContent = this.#adat.teljesitve
        ? 'COMPLETED'
        : `Skill: ${this.#adat.kategoria} • +${this.#adat.xpJutalom} XP`;
      window.dispatchEvent(new CustomEvent('jutalomvaltozas', { detail: jutalom }));
    });

    li.querySelector('.gomb-szerkeszt').addEventListener('click', () => {
      this.#nezet.szerkeszt(this.#adat);
    });

    li.querySelector('.gomb-torol').addEventListener('click', () => {
      Feladat.torol(this.#adat.id);
      li.remove();
    });
  }
}

export class FeladatModal {
  #modal; #urlap; #rejtettId; #menteresCallback;

  constructor(modalId, urlapId, menteresCallback) {
    this.#modal = document.getElementById(modalId);
    this.#urlap = document.getElementById(urlapId);
    this.#rejtettId = document.getElementById('feladat-id');
    this.#menteresCallback = menteresCallback;
    this.#esemenyek();
  }

  megnyit(feladat = null) {
    this.#urlap.reset();
    if (feladat) {
      document.getElementById('modal-cim').textContent = 'Edit Quest';
      this.#rejtettId.value = feladat.id;
      document.getElementById('urlap-cim').value = feladat.cim;
      document.getElementById('urlap-kategoria').value = feladat.kategoria;
      document.getElementById('urlap-xp').value = feladat.xpJutalom;
      document.getElementById('urlap-coin').value = feladat.coinJutalom;
      document.getElementById('urlap-pont').value = feladat.kategoriaPont;
      document.getElementById('urlap-hatarido').value = feladat.hatarido;
    } else {
      document.getElementById('modal-cim').textContent = 'Add New Quest';
      this.#rejtettId.value = '';
    }
    this.#modal.showModal();
  }

  bezar() {
    this.#modal.close();
  }

  #esemenyek() {
    document.getElementById('modal-megse').addEventListener('click', () => this.bezar());

    this.#urlap.addEventListener('submit', (e) => {
      e.preventDefault();
      this.#menteresCallback({
        id: this.#rejtettId.value,
        cim: document.getElementById('urlap-cim').value.trim(),
        kategoria: document.getElementById('urlap-kategoria').value,
        xp: parseInt(document.getElementById('urlap-xp').value, 10),
        coin: parseInt(document.getElementById('urlap-coin').value, 10),
        pont: parseInt(document.getElementById('urlap-pont').value, 10),
        hatarido: document.getElementById('urlap-hatarido').value
      });
      this.bezar();
    });
  }
}

export class FeladatLista {
  #kontener; #modalKezelo;

  constructor(szelektor, modalKezelo) {
    this.#kontener = document.querySelector(szelektor);
    this.#modalKezelo = modalKezelo;
    this.frissit();
  }

  frissit() {
    this.#kontener.innerHTML = '';
    Feladat.osszes().forEach(f => {
      const elem = new FeladatElem(f, {
        szerkeszt: (feladat) => this.#modalKezelo.megnyit(feladat)
      });
      this.#kontener.appendChild(elem.htmlElem);
    });
  }
}
