import { Auth } from "./Auth.js";
import { Modal } from "../ui/Modal.js";

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
      <label for="auth-avatar" id="auth-avatar-label">Profile picture:</label>
      <input type="file" id="auth-avatar" accept="image/*" />
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
    const avatarFajl = authAvatar.files[0];

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
        await Auth.regisztral(nev, jelszo);

        if (avatarFajl) {
          await Auth.avatarFeltolt(Auth.aktualisFelhasznaloId(), avatarFajl);
        }

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
  profilkepModalInicializal();
}

export async function profilFrissit() {
  const felhasznalo = await Auth.aktualisFelhasznalo();

  const profilNev = document.getElementById("profil-nev");
  const profilAvatar = document.getElementById("profil-avatar");
  const profilSzint = document.getElementById("profil-szint");
  const profilProgress = document.getElementById("profil-progress");
  const profilCoin = document.getElementById("profil-coin");

  if (!felhasznalo) {
    profilNev.textContent = "Guest";
    profilAvatar.src = "img/avatar.jpg";
    profilAvatar.alt = "Guest avatar";
    profilSzint.textContent = "LVL 1 EXPLORER";
    profilProgress.value = 0;
    profilCoin.textContent = "0";
    return;
  }

  profilNev.textContent = felhasznalo.nev;
  profilAvatar.src = felhasznalo.avatar;
  profilAvatar.alt = `${felhasznalo.nev} avatar`;
  profilSzint.textContent = `LVL ${felhasznalo.szint} EXPLORER`;
  profilProgress.value = felhasznalo.szintProgressz;
  profilCoin.textContent = felhasznalo.coin;
}
function profilkepModalInicializal() {
  const modal = new Modal(
    "profilkep-modal",
    `
    <form id="profilkep-urlap">
      <h3>Change profile picture</h3>

      <label for="profilkep-fajl">Profile picture:</label>
      <input type="file" id="profilkep-fajl" accept="image/*" required />

      <div class="modal-gombok">
        <button type="button" id="profilkep-megse">Cancel</button>
        <button type="submit">Save</button>
      </div>
    </form>
    `,
  );

  const profilAvatar = document.getElementById("profil-avatar");
  const profilkepFajl = modal.keres("#profilkep-fajl");

  profilAvatar.style.cursor = "pointer";

  profilAvatar.addEventListener("click", () => {
    if (!Auth.beVanJelentkezve()) {
      alert("You need to be logged in to change your profile picture!");
      return;
    }

    modal.urlap.reset();
    modal.megnyit();
  });

  modal.keres("#profilkep-megse").addEventListener("click", () => {
    modal.bezar();
  });

  modal.urlap.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fajl = profilkepFajl.files[0];

    if (!fajl) {
      alert("Please choose an image!");
      return;
    }

    try {
      await Auth.avatarFeltolt(Auth.aktualisFelhasznaloId(), fajl);
      await profilFrissit();
      modal.bezar();
    } catch (error) {
      alert(error.message);
    }
  });
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
