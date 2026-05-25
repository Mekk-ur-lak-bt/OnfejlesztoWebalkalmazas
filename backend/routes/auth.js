const express = require("express");
const Felhasznalo = require("../models/Felhasznalo");

const router = express.Router();

router.post("/regisztracio", (req, res) => {
  const { nev, jelszo, avatar } = req.body;

  if (!nev || !jelszo) {
    return res.status(400).json({ uzenet: "A név és a jelszó megadása kötelező!" });
  }

  if (Felhasznalo.keresByNev(nev)) {
    return res.status(409).json({ uzenet: "Ez a felhasználónév már foglalt!" });
  }

  const ujFelhasznalo = Felhasznalo.letrehoz(nev, jelszo, avatar);
  res.status(201).json({ uzenet: "Sikeres regisztráció!", felhasznalo: ujFelhasznalo });
});

router.post("/bejelentkezes", (req, res) => {
  const { nev, jelszo } = req.body;

  if (!nev || !jelszo) {
    return res.status(400).json({ uzenet: "A név és a jelszó megadása kötelező!" });
  }

  const felhasznalo = Felhasznalo.keresByNev(nev);

  if (!felhasznalo || felhasznalo.jelszo !== jelszo) {
    return res.status(401).json({ uzenet: "Hibás felhasználónév vagy jelszó!" });
  }

  res.json({ uzenet: "Sikeres bejelentkezés!", felhasznalo: Felhasznalo.sorbolObjektum(felhasznalo) });
});

module.exports = router;
