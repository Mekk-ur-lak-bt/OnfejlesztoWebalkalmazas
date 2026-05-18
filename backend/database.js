const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS felhasznalo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nev TEXT NOT NULL UNIQUE,
  jelszo TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  coin INTEGER NOT NULL DEFAULT 0,
  szint INTEGER NOT NULL DEFAULT 1,
  avatar TEXT DEFAULT 'img/avatar.jpg'
);

CREATE TABLE IF NOT EXISTS kategoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  felhasznalo_id INTEGER NOT NULL,
  nev TEXT NOT NULL,
  pontok INTEGER NOT NULL DEFAULT 0,

  FOREIGN KEY (felhasznalo_id)
    REFERENCES felhasznalo(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feladat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  felhasznalo_id INTEGER NOT NULL,
  kategoria_id INTEGER NOT NULL,
  cim TEXT NOT NULL,
  xp_jutalom INTEGER NOT NULL DEFAULT 0,
  coin_jutalom INTEGER NOT NULL DEFAULT 0,
  kategoria_pont INTEGER NOT NULL DEFAULT 0,
  teljesitve INTEGER NOT NULL DEFAULT 0,
  hatarido TEXT,

  FOREIGN KEY (felhasznalo_id)
    REFERENCES felhasznalo(id)
    ON DELETE CASCADE,

  FOREIGN KEY (kategoria_id)
    REFERENCES kategoria(id)
    ON DELETE CASCADE
);
`);

module.exports = db;