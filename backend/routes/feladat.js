const express = require("express");
const Feladat = require("../models/Feladat");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(Feladat.osszes(req.query.felhasznaloId));
});

router.get("/:id", (req, res) => {
  const feladat = Feladat.keres(req.params.id);
  if (!feladat) return res.status(404).json({ uzenet: "Feladat nem található!" });
  res.json(feladat);
});

router.post("/", (req, res) => {
  const { felhasznaloId, kategoriaId, cim, ...rest } = req.body;
  if (!felhasznaloId || !kategoriaId || !cim) {
    return res.status(400).json({ uzenet: "A felhasználó, kategória és cím megadása kötelező!" });
  }
  if (!Feladat.felhasznaloLetezik(felhasznaloId)) {
    return res.status(404).json({ uzenet: "A megadott felhasználó nem található!" });
  }
  if (!Feladat.kategoriaLetezik(kategoriaId, felhasznaloId)) {
    return res.status(404).json({ uzenet: "A megadott kategória nem található ennél a felhasználónál!" });
  }
  res.status(201).json(Feladat.letrehoz({ felhasznaloId, kategoriaId, cim, ...rest }));
});

router.put("/:id", (req, res) => {
  const feladat = Feladat.keres(req.params.id);
  if (!feladat) return res.status(404).json({ uzenet: "Feladat nem található!" });
  const kategoriaId = req.body.kategoriaId ?? feladat.kategoriaId;
  if (!Feladat.kategoriaLetezik(kategoriaId, feladat.felhasznaloId)) {
    return res.status(404).json({ uzenet: "A megadott kategória nem található ennél a felhasználónál!" });
  }
  res.json(Feladat.szerkeszt(req.params.id, req.body));
});

router.patch("/:id/teljesit", (req, res) => {
  if (!Feladat.keres(req.params.id)) return res.status(404).json({ uzenet: "Feladat nem található!" });
  const eredmeny = Feladat.teljesit(req.params.id);
  res.json({
    uzenet: eredmeny.feladat.teljesitve ? "Feladat teljesítve!" : "Feladat teljesítése visszavonva!",
    ...eredmeny,
  });
});

router.patch("/:id/reset", (req, res) => {
  if (!Feladat.keres(req.params.id)) return res.status(404).json({ uzenet: "Feladat nem található!" });
  res.json(Feladat.reset(req.params.id));
});

router.delete("/:id", (req, res) => {
  if (!Feladat.keres(req.params.id)) return res.status(404).json({ uzenet: "Feladat nem található!" });
  Feladat.torol(req.params.id);
  res.json({ uzenet: "Feladat törölve!" });
});

module.exports = router;
