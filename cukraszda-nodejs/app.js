const express = require("express");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();

const sequelize = require("./config/database");
const { passUserToViews } = require("./middleware/auth");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

//View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Body parserek
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Statikus fájlok, egyéb middleware-ek
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(methodOverride("_method"));

//Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cukraszda_secret_key_2025",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 óra
    },
  })
);

//User átadása a view-knak
app.use(passUserToViews);

//ROUTE
app.use("/", routes);

// handler
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Az oldal nem található.",
  });
});

//Adatbázis + szerver indítás
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✓ Adatbázis kapcsolat rendben.");

    await sequelize.sync();
    console.log("✓ Adatbázis modellek szinkronizálva.");

    app.listen(PORT, () => {
      console.log(`✓ Szerver fut a http://localhost:${PORT} címen`);
      console.log("  Nyomd meg a CTRL+C-t a leállításhoz");
    });
  } catch (error) {
    console.error("✗ Nem sikerült elindítani a szervert:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
