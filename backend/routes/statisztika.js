const express = require("express");
const db = require("../database");

const router = express.Router();

function szintProgressz(xp) {
  return xp % 100;
}

function csillagErtek(pontok) {
  switch (true) {
    case pontok >= 1000:
      return 5;
    case pontok >= 500:
      return 4;
    case pontok >= 250:
      return 3;
    case pontok >= 100:
      return 2;
    default:
      return 1;
  }
}

router.get("/:felhasznaloId", (req, res) => {
  const felhasznaloId = Number(req.params.felhasznaloId);

  const felhasznalo = db
    .prepare(`
      SELECT id, nev, xp, coin, szint, avatar
      FROM felhasznalo
      WHERE id = ?
    `)
    .get(felhasznaloId);

  if (!felhasznalo) {
    return res.status(404).json({
      uzenet: "Felhasználó nem található!",
    });
  }

  const kategoriak = db
    .prepare(`
      SELECT id, nev, pontok
      FROM kategoria
      WHERE felhasznalo_id = ?
    `)
    .all(felhasznaloId);

  const teljesFeladatokSzama = db
    .prepare(`
      SELECT COUNT(*) AS darab
      FROM feladat
      WHERE felhasznalo_id = ?
    `)
    .get(felhasznaloId).darab;

  const teljesitettFeladatokSzama = db
    .prepare(`
      SELECT COUNT(*) AS darab
      FROM feladat
      WHERE felhasznalo_id = ?
      AND teljesitve = 1
    `)
    .get(felhasznaloId).darab;

  res.json({
    scoreboard: {
      xp: felhasznalo.xp,
      coin: felhasznalo.coin,
      szint: felhasznalo.szint,
      szintProgressz: szintProgressz(felhasznalo.xp),
    },
    kategoriak: kategoriak.map((kategoria) => ({
      id: kategoria.id,
      nev: kategoria.nev,
      pontok: kategoria.pontok,
      csillag: csillagErtek(kategoria.pontok),
    })),
    feladatok: {
      osszes: teljesFeladatokSzama,
      teljesitett: teljesitettFeladatokSzama,
    },
  });
});

module.exports = router;