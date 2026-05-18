const express = require("express");

const router = express.Router();

let feladatok = [
  {
    id: 1,
    cim: "Backend route-ok megírása",
    kategoria: "Backend",
    xpJutalom: 50,
    coinJutalom: 10,
    kategoriaPont: 20,
    teljesitve: false,
    hatarido: "2026-05-20",
  },
  {
    id: 2,
    cim: "Frontend összekötése a backenddel",
    kategoria: "Frontend",
    xpJutalom: 80,
    coinJutalom: 15,
    kategoriaPont: 30,
    teljesitve: false,
    hatarido: "2026-05-22",
  },
];

let kovetkezoId = 3;


router.get("/", (req, res) => {
  res.json(feladatok);
});

/* lekeres id alapjan */
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const feladat = feladatok.find((f) => f.id === id);

  if (!feladat) {
    return res.status(404).json({ uzenet: "Feladat nem található!" });
  }

  res.json(feladat);
});

/* new task  */
router.post("/", (req, res) => {
  const {
    cim,
    kategoria,
    xpJutalom,
    coinJutalom,
    kategoriaPont,
    hatarido,
  } = req.body;

  if (!cim || !kategoria) {
    return res.status(400).json({
      uzenet: "A cím és a kategória megadása kötelező!",
    });
  }

  const ujFeladat = {
    id: kovetkezoId++,
    cim,
    kategoria,
    xpJutalom: xpJutalom ?? 0,
    coinJutalom: coinJutalom ?? 0,
    kategoriaPont: kategoriaPont ?? 0,
    teljesitve: false,
    hatarido: hatarido ?? "",
  };

  feladatok.push(ujFeladat);

  res.status(201).json(ujFeladat);
});

/* Feladat modositasa*/
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const feladat = feladatok.find((f) => f.id === id);

  if (!feladat) {
    return res.status(404).json({ uzenet: "Feladat nem található!" });
  }

  const {
    cim,
    kategoria,
    xpJutalom,
    coinJutalom,
    kategoriaPont,
    hatarido,
  } = req.body;

  feladat.cim = cim ?? feladat.cim;
  feladat.kategoria = kategoria ?? feladat.kategoria;
  feladat.xpJutalom = xpJutalom ?? feladat.xpJutalom;
  feladat.coinJutalom = coinJutalom ?? feladat.coinJutalom;
  feladat.kategoriaPont = kategoriaPont ?? feladat.kategoriaPont;
  feladat.hatarido = hatarido ?? feladat.hatarido;

  res.json(feladat);
});

/* Feladat teljesito kapcsolo */
router.patch("/:id/teljesit", (req, res) => {
  const id = Number(req.params.id);

  const feladat = feladatok.find((f) => f.id === id);

  if (!feladat) {
    return res.status(404).json({ uzenet: "Feladat nem található!" });
  }

  feladat.teljesitve = !feladat.teljesitve;

  const szorzo = feladat.teljesitve ? 1 : -1;

  res.json({
    uzenet: feladat.teljesitve
      ? "Feladat teljesítve!"
      : "Feladat teljesítése visszavonva!",
    feladat,
    jutalom: {
      xp: feladat.xpJutalom * szorzo,
      coin: feladat.coinJutalom * szorzo,
      kategoria: feladat.kategoria,
      kategoriaPont: feladat.kategoriaPont * szorzo,
    },
  });
});

/* Feladat torlese */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = feladatok.findIndex((f) => f.id === id);

  if (index === -1) {
    return res.status(404).json({ uzenet: "Feladat nem található!" });
  }

  feladatok.splice(index, 1);

  res.json({ uzenet: "Feladat törölve!" });
});

module.exports = router;