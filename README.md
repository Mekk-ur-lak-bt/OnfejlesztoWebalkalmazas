# Önfejlesztő Webalkalmazás

## Specifikáció

### Projekt leírás
Notion gamify sablon által inspirált önfejlesztő webalkalmazás, amely a napi feladatvégzést játékos élménnyé alakítja. A felhasználó feladatokat vesz fel kategóriánként, teljesítésükért XP-t és Coint kap, szintet lép, és nyomon követheti fejlődését egy vizuális statisztika oldalon. Az alkalmazás hangulatát a Vibe Room funkció személyre szabhatóvá teszi – a felhasználó megválaszthatja a hátteret és a hangulati elemeket.

### Célközönség
Diákok és fiatal felnőttek, akik szeretnék produktívabbá tenni a mindennapjaikat, de a hagyományos todo alkalmazások nem motiválják őket eléggé.

### Főbb funkciók
- **Todo lista** A felhasználó feladatokat hozhat létre, szerkeszthet és törölhet. Minden feladathoz tartozik egy kategória, XP jutalom, Coin jutalom és kategóriaspecifikus pont. Teljesítéskor ezek automatikusan jóváíródnak.
- **Scoreboard** A felhasználói kártyán megjelenik az összesített XP, Coin és az aktuális szint. A szintlépés XP küszöbértékek alapján történik, a következő szintig való haladás egy progress barral vizualizált.
- **Statisztika** Egy 5 ágú radar chart mutatja a különböző kategóriákban elért pontokat. Minél több pontot gyűjt a felhasználó egy kategóriában, annál több csillagot kap.
- **Vibe Room** A felhasználó személyre szabhatja az alkalmazás hátterét és hangulati elemeit. Választható háttérképek és opcionális háttérhangok teszik egyedivé az élményt.

### Továbbfejlesztési lehetőségek
Az alkalmazás bővíthető architektúrával készül, mint az achievement rendszer, a naptár integráció, a badge shop és a felhasználói modul rendezhetősége – a kód módosítása nélkül illeszthetők be a meglévő osztályok mellé.

## Technológiák
**Frontend** HTML, CSS, JavaScript
**Backend** Node.js, Express.js
**Adatbázis** SQLite, better-sqlite3
**Tesztelés** Cypress
**Verziókövetés** GitHub Organization
**Projektmenedzsment** Trello

## Csapat és szerepek 
**Huszár Fruzsina Anna** Frontend fejlesztés(Feladat, Statisztika) és UI kialakítás, Prototípus, Funkciólista, Dokumentáció(mindenki a saját részét írja le), README.md formázás.
**Horváth Levente Roland** Backend logika és API fejlesztés, Frontend(Felhasznalo), Projektmenedzsment(Trello), Funkciólista, Dokumentáció(mindenki a saját részét írja le), Specifikáció.
**Harnos Vanda Alina** Adatbázis kezelés, tesztelés, Frontend(Kategoria), UML Tervezés, Funkciólista, Dokumentáció(mindenki a saját részét írja le), Specifikáció.

## Mappastruktúra 
project/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── root.css
│   │   ├── stilusok.css
│   │   ├── elrendezes.css
│   │   ├── betutipus.css
│   │   ├── animacio.css
│   │   └── statisztika.css
│   └── js/
│       ├── index.js
│       ├── Felhasznalo.js
│       ├── Feladat.js
│       ├── Kategoria.js
│       └── Statisztika.js
│
└── backend/
    ├── app.js
    ├── database.js
    ├── database.db
    ├── models/
    │   ├── Felhasznalo.js
    │   ├── Feladat.js
    │   ├── Kategoria.js
    │   └── Statisztika.js
    └── routes/
        ├── felhasznalo.js
        ├── feladat.js
        └── kategoria.js
