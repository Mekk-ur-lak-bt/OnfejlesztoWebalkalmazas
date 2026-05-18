const express = require("express");
const Felhasznalo = require("../models/Felhasznalo");

const router = express.Router();

let felhasznalok = [
  new Felhasznalo(1, "teszt felhasznalo", 120, 30, 2, "avatar-1.png"),
];

let kovetkezoId = 2;

// fewlhasznalo lekérése id alapján
router.get("/", (req, res) => {
  res.json(felhasznalok);
});

// egy felh lekeres id alapjan
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const felhasznalo = felhasznalok.find((f) => f.id === id);

  if (!felhasznalo) {
    return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  }

  res.json(felhasznalo);
});

// uj felh letrehoz.
router.post("/", (req, res) => {
  const { nev, avatar } = req.body;

  if (!nev) {
    return res.status(400).json({
      uzenet: "A név megadása kötelező!",
    });
  }

  const ujFelhasznalo = Felhasznalo.letrehoz(nev, avatar ?? "");

  ujFelhasznalo.id = kovetkezoId;
  kovetkezoId++;

  felhasznalok.push(ujFelhasznalo);

  res.status(201).json(ujFelhasznalo);
});

// XP hozzaad felh.
router.patch("/:id/xp", (req, res) => {
  const id = Number(req.params.id);
  const { mennyiseg } = req.body;

  const felhasznalo = felhasznalok.find((f) => f.id === id);

  if (!felhasznalo) {
    return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  }

  if (typeof mennyiseg !== "number") {
    return res.status(400).json({
      uzenet: "A mennyiségnek számnak kell lennie!",
    });
  }

  felhasznalo.xpHozzaad(mennyiseg);

  res.json({
    uzenet: "XP hozzáadva!",
    felhasznalo,
  });
});

// Coin hozzaad felh.
router.patch("/:id/coin", (req, res) => {
  const id = Number(req.params.id);
  const { mennyiseg } = req.body;

  const felhasznalo = felhasznalok.find((f) => f.id === id);

  if (!felhasznalo) {
    return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  }

  if (typeof mennyiseg !== "number") {
    return res.status(400).json({
      uzenet: "A mennyiségnek számnak kell lennie!",
    });
  }

  felhasznalo.coinHozzaad(mennyiseg);

  res.json({
    uzenet: "Coin hozzáadva!",
    felhasznalo,
  });
});

module.exports = router;