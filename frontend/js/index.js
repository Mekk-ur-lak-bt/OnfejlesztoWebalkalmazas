import { Feladat, FeladatLista } from "./Feladat.js";
import { MiniKartya, RadarDiagram } from "./Statisztika.js";
import { Auth } from "./Auth.js";
import { authUiInicializal, profilFrissit } from "./auth-ui.js";

const radar = new RadarDiagram(".radar-diagram", Auth.aktualisFelhasznaloId());
const lista = new FeladatLista(".feladat-lista", Auth.aktualisFelhasznaloId());
const miniKartya = new MiniKartya(Auth.aktualisFelhasznaloId());

document
  .getElementById("uj-feladat-gomb")
  .addEventListener("click", async () => {
    if (!Auth.beVanJelentkezve()) {
      alert("A feladatok kezeléséhez be kell jelentkezned!");
      return;
    }
    await lista.megnyit();
  });

window.addEventListener("jutalomvaltozas", async (e) => {
  if (e.detail.xp > 0) miniKartya.streakNapotRogzit();
  await profilFrissit();
  await radar.frissit();
});

window.addEventListener("authValtozas", async () => {
  const felhasznaloId = Auth.aktualisFelhasznaloId();
  lista.felhasznaloIdBeallitas(felhasznaloId);
  radar.felhasznaloIdBeallitas(felhasznaloId);
  miniKartya.felhasznaloIdBeallitas(felhasznaloId);
  await lista.frissit();
  await radar.frissit();
});

await authUiInicializal();

const felhasznaloId = Auth.aktualisFelhasznaloId();
lista.felhasznaloIdBeallitas(felhasznaloId);
radar.felhasznaloIdBeallitas(felhasznaloId);
miniKartya.felhasznaloIdBeallitas(felhasznaloId);
await lista.frissit();
await radar.frissit();
