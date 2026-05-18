const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./database");
const feladatRoutes = require("./routes/feladat");
const felhasznaloRoutes = require("./routes/felhasznalo");
const kategoriaRoutes = require("./routes/kategoria");
const authRoutes = require("./routes/auth");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/feladatok", feladatRoutes);
app.use("/api/felhasznalok", felhasznaloRoutes);
app.use("/api/kategoriak", kategoriaRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(port, () => {
  console.log(`A szerver fut a ${port} porton!`);
});