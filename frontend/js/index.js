import { Feladat, FeladatLista, FeladatModal } from './feladat.js';
import { authUiInicializal, profilFrissit } from './auth-ui.js';
import { Auth } from './Auth.js';
authUiInicializal();

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

  const felhasznalo = Auth.aktualisFelhasznalo();

  if (!felhasznalo) {
    alert('Jutalom csak bejelentkezett felhasználónak jár!');
    return;
  }

  felhasznalo.xpHozzaad(xp);
  felhasznalo.coinHozzaad(coin);

  Auth.aktualisFelhasznaloFrissit(felhasznalo);
  profilFrissit();

  console.log('Jutalom hozzáadva:', {
    xp,
    coin,
    kategoria,
    pont,
    felhasznalo: felhasznalo.toJSON(),
  });
});

/* TESZT:
import { Auth } from "./Auth.js";
console.log(Auth.regisztral("Teszt felhasználó"));
console.log(Auth.aktualisFelhasznalo()); */
/* 
for (var i = 0; i < localStorage.length; i++){
   console.log(localStorage.key(i));
} */