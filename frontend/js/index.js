import { Feladat, FeladatLista } from "./osztalyok/Feladat.js";
import { MiniKartya, RadarDiagram } from "./osztalyok/Statisztika.js";
import { Auth } from "./osztalyok/Auth.js";
import { KategoriaModal } from "./osztalyok/Kategoria.js";
import { Naptar } from "./osztalyok/Naptar.js";
import { TemaValaszto } from "./osztalyok/TemaValaszto.js";
import { authUiInicializal, profilFrissit } from "./ui/auth-ui.js";
import {
  demoFigyelmeztetes,
  modalHatterInicializal,
  navigacioInicializal,
} from "./ui/html-ui.js";

demoFigyelmeztetes();

const radar = new RadarDiagram(".radar-diagram", Auth.aktualisFelhasznaloId());
const lista = new FeladatLista(".feladat-lista", Auth.aktualisFelhasznaloId());
const miniKartya = new MiniKartya(Auth.aktualisFelhasznaloId());
const kategoriaModal = new KategoriaModal(Auth.aktualisFelhasznaloId());
const oldalsavNaptar = new Naptar(".naptar-oldalsav .naptar");
const cikkNaptar = new Naptar("#naptar-lista");
new TemaValaszto();

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

window.addEventListener("kategoriaValtozas", async () => {
  await radar.frissit();
});

window.addEventListener("authValtozas", async () => {
  const felhasznaloId = Auth.aktualisFelhasznaloId();
  lista.felhasznaloIdBeallitas(felhasznaloId);
  radar.felhasznaloIdBeallitas(felhasznaloId);
  miniKartya.felhasznaloIdBeallitas(felhasznaloId);
  kategoriaModal.felhasznaloIdBeallitas(felhasznaloId);
  await lista.frissit();
  await radar.frissit();
  await naptarFrissit();
});

await authUiInicializal();

const felhasznaloId = Auth.aktualisFelhasznaloId();
lista.felhasznaloIdBeallitas(felhasznaloId);
radar.felhasznaloIdBeallitas(felhasznaloId);
miniKartya.felhasznaloIdBeallitas(felhasznaloId);
kategoriaModal.felhasznaloIdBeallitas(felhasznaloId);
await lista.frissit();
await radar.frissit();

async function naptarFrissit() {
  const feladatok = Auth.beVanJelentkezve()
    ? await Feladat.osszes(Auth.aktualisFelhasznaloId())
    : [];

  oldalsavNaptar.megjelenit(feladatok);
  cikkNaptar.megjelenit(feladatok);
}

window.addEventListener("feladatValtozas", async () => {
  await naptarFrissit();
});

await naptarFrissit();

modalHatterInicializal();
navigacioInicializal();
