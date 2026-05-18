const express = require("express");
const Kategoria = require("../models/Kategoria");

const router = express.Router();

let kategoriak = [
  new Kategoria(1, "Backend", 120),
  new Kategoria(2, "Frontend", 80),
  new Kategoria(3, "Adatbázis", 40),
];

let kovetkezoId = 4;

// ossz kat lekerese
router.get("/", (req, res) => {
  res.json(kategoriak);
});

// Egy kat lekerese id alapjan
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const kategoria = kategoriak.find((k) => k.id === id);

  if (!kategoria) {
    return res.status(404).json({ uzenet: "Kategória nem található!" });
  }

  res.json(kategoria);
});

// uj kat letrehoz.
router.post("/", (req, res) => {
  const { nev } = req.body;

  if (!nev) {
    return res.status(400).json({
      uzenet: "A kategória neve kötelező!",
    });
  }

  const ujKategoria = new Kategoria(kovetkezoId, nev, 0);
  kovetkezoId++;

  kategoriak.push(ujKategoria);

  res.status(201).json(ujKategoria);
});

// kat pont frissitese
router.patch("/:id/pont", (req, res) => {
  const id = Number(req.params.id);
  const { mennyiseg } = req.body;

  const kategoria = kategoriak.find((k) => k.id === id);

  if (!kategoria) {
    return res.status(404).json({ uzenet: "Kategória nem található!" });
  }

  if (typeof mennyiseg !== "number") {
    return res.status(400).json({
      uzenet: "A mennyiségnek számnak kell lennie!",
    });
  }

  kategoria.pontotAd(mennyiseg);

  res.json({
    uzenet: "Kategória pont frissítve!",
    kategoria,
    csillag: kategoria.csillagErtek(),
  });
});

// kat torlese
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = kategoriak.findIndex((k) => k.id === id);

  if (index === -1) {
    return res.status(404).json({ uzenet: "Kategória nem található!" });
  }

  kategoriak.splice(index, 1);

  res.json({ uzenet: "Kategória törölve!" });
});

module.exports = router;