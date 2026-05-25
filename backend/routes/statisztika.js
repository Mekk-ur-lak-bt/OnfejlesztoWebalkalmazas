const express = require("express");
const Statisztika = require("../models/Statisztika");

const router = express.Router();

router.get("/:felhasznaloId", (req, res) => {
  const adat = Statisztika.osszeallit(Number(req.params.felhasznaloId));
  if (!adat) return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  res.json(adat);
});

module.exports = router;
