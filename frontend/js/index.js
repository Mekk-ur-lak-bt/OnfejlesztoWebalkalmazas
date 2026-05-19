import { Feladat, FeladatLista, FeladatModal } from "./feladat.js";
import { MiniKartya, RadarDiagram } from "./Statisztika.js";
import { Auth } from "./Auth.js";
import { authUiInicializal, profilFrissit } from "./auth-ui.js";

const radar = new RadarDiagram(".radar-diagram", Auth.aktualisFelhasznaloId());

const modal = new FeladatModal(
  "feladat-modal",
  "feladat-urlap",
  async (adatok) => {
    const felhasznaloId = Auth.aktualisFelhasznaloId();
    if (!felhasznaloId) return;

    if (adatok.id) {
      const feladat = await Feladat.keres(adatok.id);
      if (feladat) {
        await feladat.szerkeszt(
          adatok.cim,
          adatok.kategoriaId,
          adatok.hatarido,
          adatok.pont,
          adatok.xp,
          adatok.coin,
        );
      }
    } else {
      await Feladat.letrehoz(
        felhasznaloId,
        adatok.kategoriaId,
        adatok.cim,
        adatok.xp,
        adatok.coin,
        adatok.pont,
        adatok.hatarido,
      );
    }

    modal.bezar();
    await lista.frissit();
  },
);

const lista = new FeladatLista(
  ".feladat-lista",
  modal,
  Auth.aktualisFelhasznaloId(),
);

document
  .getElementById("uj-feladat-gomb")
  .addEventListener("click", async () => {
    if (!Auth.beVanJelentkezve()) {
      alert("A feladatok kezeléséhez be kell jelentkezned!");
      return;
    }
    await modal.kategoriaFeltolt(Auth.aktualisFelhasznaloId());
    modal.megnyit();
  });

window.addEventListener("jutalomvaltozas", async () => {
  await profilFrissit();
  await radar.frissit();
});

window.addEventListener("authValtozas", async () => {
  const felhasznaloId = Auth.aktualisFelhasznaloId();
  lista.felhasznaloIdBeallitas(felhasznaloId);
  radar.felhasznaloIdBeallitas(felhasznaloId);
  await lista.frissit();
  await radar.frissit();
});

await authUiInicializal();

const felhasznaloId = Auth.aktualisFelhasznaloId();
lista.felhasznaloIdBeallitas(felhasznaloId);
radar.felhasznaloIdBeallitas(felhasznaloId);
await lista.frissit();
await radar.frissit();

new MiniKartya();
