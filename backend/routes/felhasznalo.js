const express = require("express");
const db = require("../database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const avatarMappa = path.join(__dirname, "../../frontend/uploads/avatars");

if (!fs.existsSync(avatarMappa)) {
  fs.mkdirSync(avatarMappa, { recursive: true });
}

const tarhely = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarMappa);
  },
  filename: (req, file, cb) => {
    const felhasznaloId = req.params.id;
    const kiterjesztes = path.extname(file.originalname).toLowerCase();
    const fajlNev = `avatar-${felhasznaloId}-${Date.now()}${kiterjesztes}`;

    cb(null, fajlNev);
  },
});

function kepSzuro(req, file, cb) {
  const engedelyezettTipusok = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!engedelyezettTipusok.includes(file.mimetype)) {
    return cb(new Error("Csak kép fájl tölthető fel!"));
  }

  cb(null, true);
}

const avatarFeltoltes = multer({
  storage: tarhely,
  fileFilter: kepSzuro,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

router.patch("/:id/avatar", avatarFeltoltes.single("avatar"), (req, res) => {
  const id = Number(req.params.id);

  if (!req.file) {
    return res.status(400).json({
      uzenet: "Nem érkezett feltöltött kép!",
    });
  }

  const felhasznalo = db
    .prepare("SELECT id, avatar FROM felhasznalo WHERE id = ?")
    .get(id);

  if (!felhasznalo) {
    return res.status(404).json({
      uzenet: "Felhasználó nem található!",
    });
  }

  const ujAvatarUtvonal = `uploads/avatars/${req.file.filename}`;

  db.prepare("UPDATE felhasznalo SET avatar = ? WHERE id = ?").run(
    ujAvatarUtvonal,
    id,
  );

  const frissitett = db
    .prepare(
      "SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo WHERE id = ?",
    )
    .get(id);

  res.json({
    uzenet: "Profilkép sikeresen feltöltve!",
    felhasznalo: frissitett,
  });
});
router.get("/", (req, res) => {
  const felhasznalok = db
    .prepare("SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo")
    .all();

  res.json(felhasznalok);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const felhasznalo = db
    .prepare(
      "SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo WHERE id = ?",
    )
    .get(id);

  if (!felhasznalo) {
    return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  }

  res.json(felhasznalo);
});

router.post("/", (req, res) => {
  const { nev, jelszo, avatar } = req.body;

  if (!nev || !jelszo) {
    return res.status(400).json({
      uzenet: "A név és a jelszó megadása kötelező!",
    });
  }

  try {
    const eredmeny = db
      .prepare(
        `
        INSERT INTO felhasznalo (nev, jelszo, xp, coin, szint, avatar)
        VALUES (?, ?, 0, 0, 1, ?)
      `,
      )
      .run(nev, jelszo, avatar || "img/avatar.jpg");

    const ujFelhasznalo = db
      .prepare(
        "SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo WHERE id = ?",
      )
      .get(eredmeny.lastInsertRowid);

    res.status(201).json(ujFelhasznalo);
  } catch (error) {
    res.status(400).json({
      uzenet: "Nem sikerült létrehozni a felhasználót!",
      hiba: error.message,
    });
  }
});

router.patch("/:id/xp", (req, res) => {
  const id = Number(req.params.id);
  const { mennyiseg } = req.body;

  if (typeof mennyiseg !== "number") {
    return res.status(400).json({
      uzenet: "A mennyiségnek számnak kell lennie!",
    });
  }

  const felhasznalo = db
    .prepare("SELECT * FROM felhasznalo WHERE id = ?")
    .get(id);

  if (!felhasznalo) {
    return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  }

  const ujXp = felhasznalo.xp + mennyiseg;

  let ujSzint = 1;
  if (ujXp >= 1000) ujSzint = 5;
  else if (ujXp >= 500) ujSzint = 4;
  else if (ujXp >= 250) ujSzint = 3;
  else if (ujXp >= 100) ujSzint = 2;

  db.prepare("UPDATE felhasznalo SET xp = ?, szint = ? WHERE id = ?").run(
    ujXp,
    ujSzint,
    id,
  );

  const frissitett = db
    .prepare(
      "SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo WHERE id = ?",
    )
    .get(id);

  res.json({
    uzenet: "XP hozzáadva!",
    felhasznalo: frissitett,
  });
});

router.patch("/:id/coin", (req, res) => {
  const id = Number(req.params.id);
  const { mennyiseg } = req.body;

  if (typeof mennyiseg !== "number") {
    return res.status(400).json({
      uzenet: "A mennyiségnek számnak kell lennie!",
    });
  }

  const felhasznalo = db
    .prepare("SELECT * FROM felhasznalo WHERE id = ?")
    .get(id);

  if (!felhasznalo) {
    return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  }

  db.prepare("UPDATE felhasznalo SET coin = coin + ? WHERE id = ?").run(
    mennyiseg,
    id,
  );

  const frissitett = db
    .prepare(
      "SELECT id, nev, xp, coin, szint, avatar FROM felhasznalo WHERE id = ?",
    )
    .get(id);

  res.json({
    uzenet: "Coin hozzáadva!",
    felhasznalo: frissitett,
  });
});

module.exports = router;
