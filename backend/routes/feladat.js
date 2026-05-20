const express = require("express");
const db = require("../database");

const router = express.Router();

function feladatSorbolObjektum(sor) {
  return {
    id: sor.id,
    felhasznaloId: sor.felhasznalo_id,
    kategoriaId: sor.kategoria_id,
    cim: sor.cim,
    xpJutalom: sor.xp_jutalom,
    coinJutalom: sor.coin_jutalom,
    kategoriaPont: sor.kategoria_pont,
    teljesitve: Boolean(sor.teljesitve),
    hatarido: sor.hatarido,
  };
}

router.get("/", (req, res) => {
  const { felhasznaloId } = req.query;
  let sorok;
  if (felhasznaloId) {
    sorok = db
      .prepare("SELECT * FROM feladat WHERE felhasznalo_id = ?")
      .all(Number(felhasznaloId));
  } else {
    sorok = db.prepare("SELECT * FROM feladat").all();
  }
  res.json(sorok.map(feladatSorbolObjektum));
});

router.get("/:id", (req, res) => {
  const sor = db
    .prepare("SELECT * FROM feladat WHERE id = ?")
    .get(Number(req.params.id));
  if (!sor) return res.status(404).json({ uzenet: "Feladat nem található!" });
  res.json(feladatSorbolObjektum(sor));
});

router.post("/", (req, res) => {
  const {
    felhasznaloId,
    kategoriaId,
    cim,
    xpJutalom,
    coinJutalom,
    kategoriaPont,
    hatarido,
  } = req.body;

  if (!felhasznaloId || !kategoriaId || !cim) {
    return res
      .status(400)
      .json({ uzenet: "A felhasználó, kategória és cím megadása kötelező!" });
  }

  if (
    !db
      .prepare("SELECT id FROM felhasznalo WHERE id = ?")
      .get(Number(felhasznaloId))
  ) {
    return res
      .status(404)
      .json({ uzenet: "A megadott felhasználó nem található!" });
  }

  if (
    !db
      .prepare("SELECT id FROM kategoria WHERE id = ? AND felhasznalo_id = ?")
      .get(Number(kategoriaId), Number(felhasznaloId))
  ) {
    return res
      .status(404)
      .json({
        uzenet: "A megadott kategória nem található ennél a felhasználónál!",
      });
  }

  const eredmeny = db
    .prepare(
      `
    INSERT INTO feladat (felhasznalo_id, kategoria_id, cim, xp_jutalom, coin_jutalom, kategoria_pont, teljesitve, hatarido)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `
    )
    .run(
      Number(felhasznaloId),
      Number(kategoriaId),
      cim,
      xpJutalom ?? 0,
      coinJutalom ?? 0,
      kategoriaPont ?? 0,
      hatarido ?? null
    );

  res
    .status(201)
    .json(
      feladatSorbolObjektum(
        db
          .prepare("SELECT * FROM feladat WHERE id = ?")
          .get(eredmeny.lastInsertRowid)
      )
    );
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const letezo = db.prepare("SELECT * FROM feladat WHERE id = ?").get(id);
  if (!letezo)
    return res.status(404).json({ uzenet: "Feladat nem található!" });

  const { kategoriaId, cim, xpJutalom, coinJutalom, kategoriaPont, hatarido } =
    req.body;
  const ujKategoriaId = kategoriaId ?? letezo.kategoria_id;

  if (
    !db
      .prepare("SELECT id FROM kategoria WHERE id = ? AND felhasznalo_id = ?")
      .get(Number(ujKategoriaId), letezo.felhasznalo_id)
  ) {
    return res
      .status(404)
      .json({
        uzenet: "A megadott kategória nem található ennél a felhasználónál!",
      });
  }

  db.prepare(
    `
    UPDATE feladat SET kategoria_id = ?, cim = ?, xp_jutalom = ?, coin_jutalom = ?, kategoria_pont = ?, hatarido = ?
    WHERE id = ?
  `
  ).run(
    Number(ujKategoriaId),
    cim ?? letezo.cim,
    xpJutalom ?? letezo.xp_jutalom,
    coinJutalom ?? letezo.coin_jutalom,
    kategoriaPont ?? letezo.kategoria_pont,
    hatarido ?? letezo.hatarido,
    id
  );

  res.json(
    feladatSorbolObjektum(
      db.prepare("SELECT * FROM feladat WHERE id = ?").get(id)
    )
  );
});

router.patch("/:id/teljesit", (req, res) => {
  const id = Number(req.params.id);
  const feladat = db.prepare("SELECT * FROM feladat WHERE id = ?").get(id);
  if (!feladat)
    return res.status(404).json({ uzenet: "Feladat nem található!" });

  const ujTeljesitve = feladat.teljesitve ? 0 : 1;
  const szorzo = ujTeljesitve ? 1 : -1;

  db.prepare("UPDATE feladat SET teljesitve = ? WHERE id = ?").run(
    ujTeljesitve,
    id
  );
  db.prepare(
    "UPDATE felhasznalo SET xp = xp + ?, coin = coin + ? WHERE id = ?"
  ).run(
    feladat.xp_jutalom * szorzo,
    feladat.coin_jutalom * szorzo,
    feladat.felhasznalo_id
  );

  const ujXp = db
    .prepare("SELECT xp FROM felhasznalo WHERE id = ?")
    .get(feladat.felhasznalo_id).xp;
  let ujSzint = 1;
  if (ujXp >= 1000) ujSzint = 5;
  else if (ujXp >= 500) ujSzint = 4;
  else if (ujXp >= 250) ujSzint = 3;
  else if (ujXp >= 100) ujSzint = 2;

  db.prepare("UPDATE felhasznalo SET szint = ? WHERE id = ?").run(
    ujSzint,
    feladat.felhasznalo_id
  );
  db.prepare("UPDATE kategoria SET pontok = pontok + ? WHERE id = ?").run(
    feladat.kategoria_pont * szorzo,
    feladat.kategoria_id
  );

  res.json({
    uzenet: ujTeljesitve
      ? "Feladat teljesítve!"
      : "Feladat teljesítése visszavonva!",
    feladat: feladatSorbolObjektum(
      db.prepare("SELECT * FROM feladat WHERE id = ?").get(id)
    ),
    jutalom: {
      xp: feladat.xp_jutalom * szorzo,
      coin: feladat.coin_jutalom * szorzo,
      kategoriaId: feladat.kategoria_id,
      kategoriaPont: feladat.kategoria_pont * szorzo,
    },
  });
});

router.patch("/:id/reset", (req, res) => {
  const id = Number(req.params.id);
  const feladat = db.prepare("SELECT * FROM feladat WHERE id = ?").get(id);
  if (!feladat)
    return res.status(404).json({ uzenet: "Feladat nem található!" });

  db.prepare("UPDATE feladat SET teljesitve = 0 WHERE id = ?").run(id);

  res.json(
    feladatSorbolObjektum(
      db.prepare("SELECT * FROM feladat WHERE id = ?").get(id)
    )
  );
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!db.prepare("SELECT id FROM feladat WHERE id = ?").get(id)) {
    return res.status(404).json({ uzenet: "Feladat nem található!" });
  }
  db.prepare("DELETE FROM feladat WHERE id = ?").run(id);
  res.json({ uzenet: "Feladat törölve!" });
});

module.exports = router;
