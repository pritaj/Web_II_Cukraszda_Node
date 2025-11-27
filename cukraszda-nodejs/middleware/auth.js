// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === "admin") {
    return next();
  }
  res.status(403).render("error", {
    message:
      "Hozzáférés megtagadva! Csak adminisztrátorok férhetnek hozzá ehhez az oldalhoz.",
    user: req.session.userId ? { role: req.session.userRole } : null,
  });
};

// Middleware to check if user is guest (not logged in)
const isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect("/");
  }
  next();
};

// Middleware to pass user data to all views
const passUserToViews = (req, res, next) => {
  res.locals.user = null;
  if (req.session && req.session.userId) {
    res.locals.user = {
      id: req.session.userId,
      name: req.session.userName,
      email: req.session.userEmail,
      role: req.session.userRole,
    };
  }
  next();
};

const path = require("path");

app.use(BASE_PATH, express.static(path.join(__dirname, "public")));
app.use(BASE_PATH + "/assets", express.static(path.join(__dirname, "assets")));

app.use(BASE_PATH, routes);

module.exports = {
  isAuthenticated,
  isAdmin,
  isGuest,
  passUserToViews,
};
