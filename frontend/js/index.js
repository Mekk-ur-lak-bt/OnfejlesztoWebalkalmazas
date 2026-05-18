import { Feladat, FeladatLista, FeladatModal } from './feladat.js';

const modal = new FeladatModal('feladat-modal', 'feladat-urlap', (adatok) => {
  if (adatok.id) {
    const feladat = Feladat.keres(adatok.id);
    if (feladat) {
      feladat.szerkeszt(adatok.cim, adatok.kategoria, adatok.hatarido, adatok.pont, adatok.xp, adatok.coin);
    }
  } else {
    Feladat.letrehoz(adatok.cim, adatok.kategoria, adatok.xp, adatok.coin, adatok.pont, adatok.hatarido);
  }
  lista.frissit();
});

const lista = new FeladatLista('.feladat-lista', modal);

document.getElementById('uj-feladat-gomb').addEventListener('click', () => {
  modal.megnyit();
});

window.addEventListener('jutalomvaltozas', (e) => {
  const { xp, coin, kategoria, pont } = e.detail;
  console.log('Jutalom változás:', { xp, coin, kategoria, pont });
});
