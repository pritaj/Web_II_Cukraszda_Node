//import "tailwindcss/tailwind.css";

const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// EJS + layout
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/app");
app.use(express.static("public"));

// statikus fájlok (css, js, képek, favicon)
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

// middleware, hogy user + flash szerű dolgok menjenek a view-ba
app.use((req, res, next) => {
  // ide jöhet valódi auth később
  res.locals.user = null; // vagy { name: 'Rita', role: 'admin' }
  res.locals.success = null;
  res.locals.error = null;
  next();
});

app.get("/", (req, res) => {
  res.render("home", {
    title: "Főoldal - Cukrászda",
    success: null,
    error: null,
  });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
