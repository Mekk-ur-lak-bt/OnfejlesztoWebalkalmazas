# Dream Team Dashboard

**A gamified self-development web application** inspired by Notion templates, turning daily task management into an RPG experience. Users create tasks by category, earn XP and Coins on completion, level up, and track progress on a visual statistics dashboard.

---

## Features

- **Gamified Todo List** — Create, edit, and delete daily tasks with custom XP, Coin, and category-specific point rewards. Tasks reset each day so rewards can be earned again.
- **Scoreboard** — Real-time level tracking with a progress bar, total XP display, and collected currency.
- **Radar Chart** — A 5-axis dynamic chart mapping progress across five attributes: Logic, Creativity, Health, Social, and Soul.
- **Theme Selector** — Choose from multiple visual themes (GirliePop, Elegant, Nature, Game) that persist across sessions.
- **Calendar** — View tasks with deadlines on a monthly calendar with navigation.
- **Day Streak** — Tracks consecutive days with at least one completed task, resets if a day is skipped.

---

## Tech Stack

| Layer    | Technology                            |
| :------- | :------------------------------------ |
| Frontend | HTML5, CSS3, JavaScript (ES6 Modules) |
| Backend  | Node.js, Express.js                   |
| Database | SQLite via better-sqlite3             |
| Testing  | Cypress                               |

---

## Installation

> **Requirements:** Node.js must be installed on your machine.
> **Note for school or corporate computers:** Use Git Bash instead of PowerShell to avoid execution policy restrictions.

**1. Open the project**
Open the `/backend` folder in your code editor (e.g. VS Code).

**2. Install dependencies**

```bash
npm install express better-sqlite3
npm install multer
```

**3. Create database & Start the server**

```bash
node database.js
node app.js
```

**4. Open the app**
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

> The SQLite database file is created automatically on first run. Do not delete `database.sqlite` — it stores all your local user data.

---

## Important Notes

- All data is stored **locally** on your device. Registered users are not available on other machines.
- The database persists across server restarts as long as `database.sqlite` is not deleted.

---

## Development Team

Developed under **Mekk-ur-lak-bt** by:

| Name                   | Role                                                                                                                |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------ |
| Fruzsina Anna Huszár   | Frontend, UI/UX Design, Prototype, Documentation, README, Testing                                                   |
| Levente Roland Horváth | Backend Logic and API Development, Frontend (User, Auth, Calendar), Project Management, Documentation, Testing      |
| Vanda Alina Harnos     | Database Management, UML Design, Documentation, Testing                                                             |

---

# Önfejlesztő webalkalmazás — Magyar leírás

**Gamifikált önfejlesztő webalkalmazás** Notion sablonok által inspirálva, amely a napi feladatvégzést RPG-élménnyé alakítja. A felhasználó feladatokat hoz létre kategóriánként, teljesítésükért XP-t és Coint kap, szintet lép, és vizuális statisztikán követi fejlődését.

---

## Főbb funkciók

- **Gamifikált teendőlista** — Napi feladatok létrehozása, szerkesztése és törlése egyéni XP, Coin és kategóriapontok jutalommal. A feladatok minden nap visszaállnak, így a jutalmak naponta újra megszerezhetők.
- **Scoreboard** — Valós idejű szintkövetés progress barral, összesített XP-vel és gyűjtött valutával.
- **Radar diagram** — 5 tengelyes dinamikus diagram, amely öt attribútumban mutatja a fejlődést: Logic, Creativity, Health, Social, Soul.
- **Témaválasztó** — Több vizuális téma közül lehet választani (GirliePop, Elegant, Nature, Game), a választás munkameneteken átívelően megmarad.
- **Naptár** — Határidős feladatok megtekintése havi nézetben, navigációval.
- **Napi streak** — Nyomon követi az egymást követő napokat, amikor legalább egy feladatot teljesítettél; kihagyott nap esetén nulláról indul.

---

## Technológiák

| Réteg     | Technológia                           |
| :-------- | :------------------------------------ |
| Frontend  | HTML5, CSS3, JavaScript (ES6 Modules) |
| Backend   | Node.js, Express.js                   |
| Adatbázis | SQLite, better-sqlite3                |
| Tesztelés | Cypress                               |

---

## Telepítés

> **Előfeltétel:** A Node.js legyen telepítve a gépen.
> **Iskolai vagy céges számítógépen:** PowerShell helyett használj Git Bash terminált a végrehajtási korlátozások elkerülése érdekében.

**1. Nyisd meg a projektet**
Nyisd meg a `/backend` mappát a kódszerkesztőben (pl. VS Code).

**2. Függőségek telepítése**

```bash
npm install express better-sqlite3
npm install multer
```

**3. Adatbázis létrehozása & Szerver indítása**

```bash
node database.js
node app.js
```

**4. Az alkalmazás megnyitása**
Nyisd meg a böngészőt, és lépj a következő címre: [http://localhost:3000](http://localhost:3000)

> Az SQLite adatbázisfájl az első indításkor automatikusan létrejön. Ne töröld a `database.sqlite` fájlt — ebben tárolódnak a helyi felhasználói adatok.

---

## Fontos tudnivalók

- Minden adat **helyileg** tárolódik az eszközödön. A regisztrált felhasználók más gépeken nem érhetők el.
- Az adatbázis szerver-újraindítások között is megmarad, amíg a `database.sqlite` fájlt nem törlöd.

---

## Fejlesztőcsapat

Fejlesztette a **Mekk-ur-lak-bt** csapata:

| Név                    | Szerep                                                                                                              |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------ |
| Huszár Fruzsina Anna   | Frontend, UI/UX tervezés, Prototípus, Dokumentáció, README, Tesztelés                                               |
| Horváth Levente Roland | Backend logika és API fejlesztés, Frontend (Felhasználó, Auth, Naptár), Projektmenedzsment, Dokumentáció, Tesztelés |
| Harnos Vanda Alina     | Adatbázis-kezelés, UML tervezés, Dokumentáció, Tesztelés                                                            |
