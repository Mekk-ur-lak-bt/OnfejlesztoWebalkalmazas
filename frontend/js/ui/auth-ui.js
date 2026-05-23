import { Auth } from "../osztalyok/Auth.js";
import { Modal } from "./Modal.js";

function authValtozastKiald() {
  window.dispatchEvent(new CustomEvent("authValtozas"));
}

export async function authUiInicializal() {
  const modal = new Modal(
    "auth-modal",
    `
    <form id="auth-urlap">
      <h3 id="auth-modal-cim">Login</h3>
      <input type="hidden" id="auth-mod" />
      <label for="auth-nev">Username:</label>
      <input type="text" id="auth-nev" required />
      <label for="auth-jelszo">Password:</label>
      <input type="password" id="auth-jelszo" required />
      <label for="auth-avatar" id="auth-avatar-label">Avatar URL:</label>
      <input type="text" id="auth-avatar" placeholder="img/avatar.jpg" />
      <div class="modal-gombok">
        <button type="button" id="auth-megse">Cancel</button>
        <button type="submit" id="auth-mentes">Save</button>
      </div>
    </form>
  `,
  );

  const authModalCim = modal.keres("#auth-modal-cim");
  const authMod = modal.keres("#auth-mod");
  const authNev = modal.keres("#auth-nev");
  const authJelszo = modal.keres("#auth-jelszo");
  const authAvatar = modal.keres("#auth-avatar");
  const authAvatarLabel = modal.keres("#auth-avatar-label");

  document
    .getElementById("regisztracio-link")
    .addEventListener("click", (e) => {
      e.preventDefault();
      modal.urlap.reset();
      authMod.value = "registration";
      authModalCim.textContent = "Registration";
      authAvatar.hidden = false;
      authAvatarLabel.hidden = false;
      modal.megnyit();
    });

  document
    .getElementById("bejelentkezes-link")
    .addEventListener("click", (e) => {
      e.preventDefault();
      modal.urlap.reset();
      authMod.value = "login";
      authModalCim.textContent = "Login";
      authAvatar.hidden = true;
      authAvatarLabel.hidden = true;
      modal.megnyit();
    });

  document
    .getElementById("kijelentkezes-link")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      Auth.kijelentkezik();
      await profilFrissit();
      menuFrissit();
      authValtozastKiald();
    });

  modal.keres("#auth-megse").addEventListener("click", () => modal.bezar());

  modal.urlap.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nev = authNev.value.trim();
    const jelszo = authJelszo.value.trim();
    const avatar = authAvatar.value.trim() || "img/avatar.jpg";

    if (!nev) {
      alert("A felhasználónév nem lehet üres!");
      return;
    }
    if (!jelszo) {
      alert("A jelszó nem lehet üres!");
      return;
    }

    try {
      if (authMod.value === "registration") {
        await Auth.regisztral(nev, jelszo, avatar);
        alert("Sikeres regisztráció!");
      }
      if (authMod.value === "login") {
        await Auth.bejelentkezik(nev, jelszo);
        alert("Sikeres bejelentkezés!");
      }
      await profilFrissit();
      menuFrissit();
      modal.bezar();
      authValtozastKiald();
    } catch (error) {
      alert(error.message);
    }
  });

  await profilFrissit();
  menuFrissit();
}

export async function profilFrissit() {
  const felhasznalo = await Auth.aktualisFelhasznalo();

  const profilNev = document.getElementById("profil-nev");
  const profilAvatar = document.getElementById("profil-avatar");
  const profilSzint = document.getElementById("profil-szint");
  const profilProgress = document.getElementById("profil-progress");
  const profilCoin = document.getElementById("profil-coin");

  if (!felhasznalo) {
    profilNev.textContent = "Vendég";
    profilAvatar.src = "img/avatar.jpg";
    profilAvatar.alt = "Vendég avatarja";
    profilSzint.textContent = "LVL 1 EXPLORER";
    profilProgress.value = 0;
    profilCoin.textContent = "0";
    return;
  }

  profilNev.textContent = felhasznalo.nev;
  profilAvatar.src = felhasznalo.avatar;
  profilAvatar.alt = `${felhasznalo.nev} avatarja`;
  profilSzint.textContent = `LVL ${felhasznalo.szint} EXPLORER`;
  profilProgress.value = felhasznalo.szintProgressz();
  profilCoin.textContent = felhasznalo.coin;
}

function menuFrissit() {
  const beVanJelentkezve = Auth.beVanJelentkezve();
  document
    .getElementById("regisztracio-li")
    .classList.toggle("hidden", beVanJelentkezve);
  document
    .getElementById("bejelentkezes-li")
    .classList.toggle("hidden", beVanJelentkezve);
  document
    .getElementById("kijelentkezes-li")
    .classList.toggle("hidden", !beVanJelentkezve);
}
