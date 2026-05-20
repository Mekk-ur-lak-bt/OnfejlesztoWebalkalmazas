import { Auth } from "./Auth.js";

function authValtozastKiald() {
  window.dispatchEvent(new CustomEvent("authValtozas"));
}

export async function authUiInicializal() {
  const regisztracioLink = document.getElementById("regisztracio-link");
  const bejelentkezesLink = document.getElementById("bejelentkezes-link");
  const kijelentkezesLink = document.getElementById("kijelentkezes-link");

  const authModal = document.getElementById("auth-modal");
  const authUrlap = document.getElementById("auth-urlap");
  const authModalCim = document.getElementById("auth-modal-cim");
  const authMod = document.getElementById("auth-mod");

  const authNev = document.getElementById("auth-nev");
  const authJelszo = document.getElementById("auth-jelszo");
  const authAvatar = document.getElementById("auth-avatar");
  const authAvatarLabel = document.getElementById("auth-avatar-label");

  const authMegse = document.getElementById("auth-megse");

  regisztracioLink.addEventListener("click", (event) => {
    event.preventDefault();
    authUrlap.reset();
    authMod.value = "registration";
    authModalCim.textContent = "Registration";
    authAvatar.hidden = false;
    authAvatarLabel.hidden = false;
    authModal.showModal();
  });

  bejelentkezesLink.addEventListener("click", (event) => {
    event.preventDefault();
    authUrlap.reset();
    authMod.value = "login";
    authModalCim.textContent = "Login";
    authAvatar.hidden = true;
    authAvatarLabel.hidden = true;
    authModal.showModal();
  });

  kijelentkezesLink.addEventListener("click", async (event) => {
    event.preventDefault();
    Auth.kijelentkezik();
    await profilFrissit();
    menuFrissit();
    authValtozastKiald();
  });

  authMegse.addEventListener("click", () => {
    authModal.close();
  });

  authUrlap.addEventListener("submit", async (event) => {
    event.preventDefault();
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
      authModal.close();
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
