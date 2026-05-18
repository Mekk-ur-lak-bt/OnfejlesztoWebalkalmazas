const express = require("express");
const db = require("../database");

const router = express.Router();

function felhasznaloJelszoNelkul(sor) {
  return {
    id: sor.id,
    nev: sor.nev,
    xp: sor.xp,
    coin: sor.coin,
    szint: sor.szint,
    avatar: sor.avatar,
  };
}

//regisztracio
router.post("/regisztracio", (req, res) => {
  const { nev, jelszo, avatar } = req.body;

  if (!nev || !jelszo) {
    return res.status(400).json({
      uzenet: "A név és a jelszó megadása kötelező!",
    });
  }

  const letezoFelhasznalo = db
    .prepare("SELECT * FROM felhasznalo WHERE nev = ?")
    .get(nev);

  if (letezoFelhasznalo) {
    return res.status(409).json({
      uzenet: "Ez a felhasználónév már foglalt!",
    });
  }

  const eredmeny = db
    .prepare(
      `
      INSERT INTO felhasznalo (nev, jelszo, xp, coin, szint, avatar)
      VALUES (?, ?, 0, 0, 1, ?)
    `,
    )
    .run(nev, jelszo, avatar || "img/avatar.jpg");

  const ujFelhasznalo = db
    .prepare("SELECT * FROM felhasznalo WHERE id = ?")
    .get(eredmeny.lastInsertRowid);

  res.status(201).json({
    uzenet: "Sikeres regisztráció!",
    felhasznalo: felhasznaloJelszoNelkul(ujFelhasznalo),
  });
});

// bejelentkezes
router.post("/bejelentkezes", (req, res) => {
  const { nev, jelszo } = req.body;

  if (!nev || !jelszo) {
    return res.status(400).json({
      uzenet: "A név és a jelszó megadása kötelező!",
    });
  }

  const felhasznalo = db
    .prepare("SELECT * FROM felhasznalo WHERE nev = ? AND jelszo = ?")
    .get(nev, jelszo);

  if (!felhasznalo) {
    return res.status(401).json({
      uzenet: "Hibás felhasználónév vagy jelszó!",
    });
  }

  res.json({
    uzenet: "Sikeres bejelentkezés!",
    felhasznalo: felhasznaloJelszoNelkul(felhasznalo),
  });
});

module.exports = router;
