const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Felhasznalo = require("../models/Felhasznalo");

const router = express.Router();

const avatarMappa = path.join(__dirname, "../../frontend/uploads/avatars");
if (!fs.existsSync(avatarMappa)) fs.mkdirSync(avatarMappa, { recursive: true });

const tarhely = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarMappa),
  filename: (req, file, cb) => {
    const kiterjesztes = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${req.params.id}-${Date.now()}${kiterjesztes}`);
  },
});

const avatarFeltoltes = multer({
  storage: tarhely,
  fileFilter: (req, file, cb) => {
    const engedelyezett = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    engedelyezett.includes(file.mimetype) ? cb(null, true) : cb(new Error("Csak kép fájl tölthető fel!"));
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.get("/", (req, res) => {
  res.json(Felhasznalo.osszes());
});

router.get("/:id", (req, res) => {
  const felhasznalo = Felhasznalo.keres(Number(req.params.id));
  if (!felhasznalo) return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  res.json(felhasznalo);
});

router.post("/", (req, res) => {
  const { nev, jelszo, avatar } = req.body;
  if (!nev || !jelszo) return res.status(400).json({ uzenet: "A név és a jelszó megadása kötelező!" });
  try {
    res.status(201).json(Felhasznalo.letrehoz(nev, jelszo, avatar));
  } catch (e) {
    res.status(400).json({ uzenet: "Nem sikerült létrehozni a felhasználót!", hiba: e.message });
  }
});

router.patch("/:id/avatar", avatarFeltoltes.single("avatar"), (req, res) => {
  const id = Number(req.params.id);
  if (!req.file) return res.status(400).json({ uzenet: "Nem érkezett feltöltött kép!" });
  const felhasznalo = Felhasznalo.keres(id);
  if (!felhasznalo) return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  const frissitett = Felhasznalo.avatarFrissit(id, `uploads/avatars/${req.file.filename}`);
  res.json({ uzenet: "Profilkép sikeresen feltöltve!", felhasznalo: frissitett });
});

router.patch("/:id/xp", (req, res) => {
  const id = Number(req.params.id);
  const { mennyiseg } = req.body;
  if (typeof mennyiseg !== "number") return res.status(400).json({ uzenet: "A mennyiségnek számnak kell lennie!" });
  if (!Felhasznalo.keres(id)) return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  res.json({ uzenet: "XP hozzáadva!", felhasznalo: Felhasznalo.xpHozzaad(id, mennyiseg) });
});

router.patch("/:id/coin", (req, res) => {
  const id = Number(req.params.id);
  const { mennyiseg } = req.body;
  if (typeof mennyiseg !== "number") return res.status(400).json({ uzenet: "A mennyiségnek számnak kell lennie!" });
  if (!Felhasznalo.keres(id)) return res.status(404).json({ uzenet: "Felhasználó nem található!" });
  res.json({ uzenet: "Coin hozzáadva!", felhasznalo: Felhasznalo.coinHozzaad(id, mennyiseg) });
});

module.exports = router;
