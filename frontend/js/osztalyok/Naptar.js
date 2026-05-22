export class Naptar {
  #kontenerek; 
  #aktualisDatum;

  constructor(szelektor) {
    this.#kontenerek = document.querySelectorAll(szelektor);
    this.#aktualisDatum = new Date();
  }

  megjelenit(feladatok) {
    this.#kontenerek.forEach((kontener) => {
      kontener.innerHTML = "";

      const ev = this.#aktualisDatum.getFullYear();
      const honap = this.#aktualisDatum.getMonth();

      const fejlec = this.#fejlecLetrehoz(ev, honap, feladatok);
      const hetNapjai = this.#hetNapjaiLetrehoz();
      const racs = this.#naptarRacsLetrehoz(ev, honap, feladatok);

      kontener.appendChild(fejlec);
      kontener.appendChild(hetNapjai);
      kontener.appendChild(racs);
    });
  }

  #fejlecLetrehoz(ev, honap, feladatok) {
    const fejlec = document.createElement("div");
    fejlec.className = "naptar-fejlec";

    const elozoGomb = document.createElement("button");
    elozoGomb.type = "button";
    elozoGomb.textContent = "‹";

    const kovetkezoGomb = document.createElement("button");
    kovetkezoGomb.type = "button";
    kovetkezoGomb.textContent = "›";

    const cim = document.createElement("h4");
    cim.textContent = this.#honapNev(ev, honap);

    elozoGomb.addEventListener("click", () => {
      this.#aktualisDatum = new Date(ev, honap - 1, 1);
      this.megjelenit(feladatok); 
    });

    kovetkezoGomb.addEventListener("click", () => {
      this.#aktualisDatum = new Date(ev, honap + 1, 1);
      this.megjelenit(feladatok);
    });

    fejlec.appendChild(elozoGomb);
    fejlec.appendChild(cim);
    fejlec.appendChild(kovetkezoGomb);

    return fejlec;
  }

  #hetNapjaiLetrehoz() {
    const napok = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];

    const sor = document.createElement("div");
    sor.className = "naptar-het-napjai";

    napok.forEach((nap) => {
      const elem = document.createElement("span");
      elem.textContent = nap;
      sor.appendChild(elem);
    });

    return sor;
  }

  #naptarRacsLetrehoz(ev, honap, feladatok) {
    const racs = document.createElement("div");
    racs.className = "naptar-racs";

    const elsoNap = new Date(ev, honap, 1);
    const utolsoNap = new Date(ev, honap + 1, 0);

    const elsoNapIndex = this.#hetfoAlapuNapIndex(elsoNap.getDay());
    const napokSzama = utolsoNap.getDate();

    for (let i = 0; i < elsoNapIndex; i++) {
      const ures = document.createElement("div");
      ures.className = "naptar-cella ures";
      racs.appendChild(ures);
    }

    for (let nap = 1; nap <= napokSzama; nap++) {
      const datum = this.#datumString(ev, honap, nap);
      const napiFeladatok = feladatok.filter(
        (feladat) => feladat.hatarido && feladat.hatarido.split("T")[0] === datum
      );

      const cella = document.createElement("div");
      cella.className = "naptar-cella";

      if (this.#maiNap(ev, honap, nap)) {
        cella.classList.add("ma");
      }

      const napSzam = document.createElement("span");
      napSzam.className = "naptar-nap-szam";
      napSzam.textContent = nap;

      cella.appendChild(napSzam);

      napiFeladatok.slice(0, 2).forEach((feladat) => {
        const feladatElem = document.createElement("p");
        feladatElem.className = "naptar-feladat";
        feladatElem.textContent = feladat.cim;

        if (feladat.teljesitve) {
          feladatElem.classList.add("kesz");
        }

        cella.appendChild(feladatElem);
      });

      if (napiFeladatok.length > 2) {
        const tobb = document.createElement("small");
        tobb.className = "naptar-tobb";
        tobb.textContent = `+${napiFeladatok.length - 2}`;
        cella.appendChild(tobb);
      }

      racs.appendChild(cella);
    }

    return racs;
  }

  #hetfoAlapuNapIndex(napIndex) {
    return napIndex === 0 ? 6 : napIndex - 1;
  }

  #datumString(ev, honap, nap) {
    const honapString = String(honap + 1).padStart(2, "0");
    const napString = String(nap).padStart(2, "0");

    return `${ev}-${honapString}-${napString}`;
  }

  #honapNev(ev, honap) {
    const datum = new Date(ev, honap, 1);

    return datum.toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
    });
  }

  #maiNap(ev, honap, nap) {
    const ma = new Date();

    return (
      ma.getFullYear() === ev &&
      ma.getMonth() === honap &&
      ma.getDate() === nap
    );
  }
}