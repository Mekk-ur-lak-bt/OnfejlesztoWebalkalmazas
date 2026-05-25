const express = require("express");
const Kategoria = require("../models/Kategoria");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(Kategoria.osszes(req.query.felhasznaloId));
});

router.get("/:id", (req, res) => {
  const kategoria = Kategoria.keres(req.params.id);
  if (!kategoria) return res.status(404).json({ uzenet: "Kategória nem található!" });
  res.json(kategoria);
});

router.post("/", (req, res) => {
  const { felhasznaloId, nev } = req.body;
  if (!felhasznaloId || !nev) {
    return res.status(400).json({ uzenet: "A felhasználó azonosítója és a kategória neve kötelező!" });
  }
  if (!Kategoria.felhasznaloLetezik(felhasznaloId)) {
    return res.status(404).json({ uzenet: "A megadott felhasználó nem található!" });
  }
  res.status(201).json(Kategoria.letrehoz(felhasznaloId, nev));
});

router.put("/:id", (req, res) => {
  const { nev } = req.body;
  if (!nev) return res.status(400).json({ uzenet: "A kategória neve kötelező!" });
  if (!Kategoria.keres(req.params.id)) return res.status(404).json({ uzenet: "Kategória nem található!" });
  res.json(Kategoria.atnevez(req.params.id, nev));
});

router.patch("/:id/pont", (req, res) => {
  const { mennyiseg } = req.body;
  if (typeof mennyiseg !== "number") return res.status(400).json({ uzenet: "A mennyiségnek számnak kell lennie!" });
  if (!Kategoria.keres(req.params.id)) return res.status(404).json({ uzenet: "Kategória nem található!" });
  const frissitett = Kategoria.pontFrissit(req.params.id, mennyiseg);
  res.json({ uzenet: "Kategória pont frissítve!", kategoria: frissitett, csillag: Kategoria.csillagErtek(frissitett.pontok) });
});

router.delete("/:id", (req, res) => {
  if (!Kategoria.keres(req.params.id)) return res.status(404).json({ uzenet: "Kategória nem található!" });
  Kategoria.torol(req.params.id);
  res.json({ uzenet: "Kategória törölve!" });
});

module.exports = router;
