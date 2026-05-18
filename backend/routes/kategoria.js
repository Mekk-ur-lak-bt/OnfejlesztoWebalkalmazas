const express = require("express");
const db = require("../database");

const router = express.Router();

function kategoriaSorbolObjektum(sor) {
  return {
    id: sor.id,
    felhasznaloId: sor.felhasznalo_id ?? sor.felhasznaloID,
    nev: sor.nev,
    pontok: sor.pontok,
  };
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

//kategoria keresek
router.get("/", (req, res) => {
  const { felhasznaloId } = req.query;

  let kategoriak;

  if (felhasznaloId) {
    kategoriak = db
      .prepare(`
        SELECT id, felhasznalo_id, nev, pontok
        FROM kategoria
        WHERE felhasznalo_id = ?
      `)
      .all(Number(felhasznaloId));
  } else {
    kategoriak = db
      .prepare(`
        SELECT id, felhasznalo_id, nev, pontok
        FROM kategoria
      `)
      .all();
  }

  res.json(kategoriak.map(kategoriaSorbolObjektum));
});

// 1 kategoria lekerese id alapjan
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const kategoria = db
    .prepare(`
      SELECT id, felhasznalo_id, nev, pontok
      FROM kategoria
      WHERE id = ?
    `)
    .get(id);

  if (!kategoria) {
    return res.status(404).json({ uzenet: "Kategória nem található!" });
  }

  res.json(kategoriaSorbolObjektum(kategoria));
});

//uj kategoria letrehozasa
router.post("/", (req, res) => {
  const { felhasznaloId, nev } = req.body;

  if (!felhasznaloId || !nev) {
    return res.status(400).json({
      uzenet: "A felhasználó azonosítója és a kategória neve kötelező!",
    });
  }

  const felhasznalo = db
    .prepare("SELECT id FROM felhasznalo WHERE id = ?")
    .get(Number(felhasznaloId));

  if (!felhasznalo) {
    return res.status(404).json({
      uzenet: "A megadott felhasználó nem található!",
    });
  }

  const eredmeny = db
    .prepare(`
      INSERT INTO kategoria (felhasznalo_id, nev, pontok)
      VALUES (?, ?, 0)
    `)
    .run(Number(felhasznaloId), nev);

  const ujKategoria = db
    .prepare(`
      SELECT id, felhasznalo_id, nev, pontok
      FROM kategoria
      WHERE id = ?
    `)
    .get(eredmeny.lastInsertRowid);

  res.status(201).json(kategoriaSorbolObjektum(ujKategoria));
});

//kategoria pont frissitese
router.patch("/:id/pont", (req, res) => {
  const id = Number(req.params.id);
  const { mennyiseg } = req.body;

  if (typeof mennyiseg !== "number") {
    return res.status(400).json({
      uzenet: "A mennyiségnek számnak kell lennie!",
    });
  }

  const kategoria = db
    .prepare("SELECT * FROM kategoria WHERE id = ?")
    .get(id);

  if (!kategoria) {
    return res.status(404).json({ uzenet: "Kategória nem található!" });
  }

  db.prepare(`
    UPDATE kategoria
    SET pontok = pontok + ?
    WHERE id = ?
  `).run(mennyiseg, id);

  const frissitett = db
    .prepare(`
      SELECT id, felhasznalo_id, nev, pontok
      FROM kategoria
      WHERE id = ?
    `)
    .get(id);

  const kategoriaObjektum = kategoriaSorbolObjektum(frissitett);

  res.json({
    uzenet: "Kategória pont frissítve!",
    kategoria: kategoriaObjektum,
    csillag: csillagErtek(kategoriaObjektum.pontok),
  });
});

//kategoria torlese
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const kategoria = db
    .prepare("SELECT id FROM kategoria WHERE id = ?")
    .get(id);

  if (!kategoria) {
    return res.status(404).json({ uzenet: "Kategória nem található!" });
  }

  db.prepare("DELETE FROM kategoria WHERE id = ?").run(id);

  res.json({ uzenet: "Kategória törölve!" });
});

module.exports = router;