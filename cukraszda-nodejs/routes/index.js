const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const HomeController = require("../controllers/HomeController");
const AuthController = require("../controllers/AuthController");
const SutiController = require("../controllers/SutiController");
const MessageController = require("../controllers/MessageController.js");
const AdminController = require("../controllers/AdminController");
const { isAuthenticated, isAdmin, isGuest } = require("../middleware/auth");

// Home routes
router.get("/", HomeController.index);

// Auth routes
router.get("/login", isGuest, AuthController.showLoginForm);
router.post(
  "/login",
  isGuest,
  [
    body("email").isEmail().withMessage("Érvényes email címet adjon meg."),
    body("password").notEmpty().withMessage("A jelszó mező kötelező."),
  ],
  AuthController.login
);

router.get("/register", isGuest, AuthController.showRegisterForm);
router.post(
  "/register",
  isGuest,
  [
    body("name").notEmpty().withMessage("A név mező kötelező."),
    body("email").isEmail().withMessage("Érvényes email címet adjon meg."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A jelszónak legalább 6 karakter hosszúnak kell lennie."),
  ],
  AuthController.register
);

router.get("/logout", AuthController.logout);

// Sutik routes
router.get("/sutik", SutiController.index);
router.get("/sutik/create", isAdmin, SutiController.create);
router.post(
  "/sutik",
  isAdmin,
  [
    body("nev").notEmpty().withMessage("A sütemény neve kötelező."),
    body("tipus").notEmpty().withMessage("A típus megadása kötelező."),
  ],
  SutiController.store
);
router.get("/sutik/:id/edit", isAdmin, SutiController.edit);
router.post(
  "/sutik/:id",
  isAdmin,
  [
    body("nev").notEmpty().withMessage("A sütemény neve kötelező."),
    body("tipus").notEmpty().withMessage("A típus megadása kötelező."),
  ],
  SutiController.update
);
router.post("/sutik/:id/delete", isAdmin, SutiController.destroy);

// Contact routes
// Contact routes
router.get("/contact", MessageController.showContactForm);
router.post(
  "/contact",
  [
    body("name").notEmpty().withMessage("A név mező kötelező."),
    body("email").isEmail().withMessage("Érvényes email címet adjon meg."),
    body("message").notEmpty().withMessage("Az üzenet mező kötelező."),
  ],
  MessageController.store
);

// Messages routes
router.get("/messages", isAuthenticated, MessageController.index);

// Diagrams - MINDENKI LÁTHATJA
router.get("/diagrams", AdminController.diagrams);

// Admin routes
router.get("/admin", isAdmin, AdminController.dashboard);

module.exports = router;
