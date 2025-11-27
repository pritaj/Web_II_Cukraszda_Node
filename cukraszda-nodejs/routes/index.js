const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const HomeController = require("../controllers/HomeController");
const AuthController = require("../controllers/AuthController");
const SutiController = require("../controllers/SutiController");
const MessageController = require("../controllers/MessageController");
const AdminController = require("../controllers/AdminController");
const DiagramController = require("../controllers/DiagramController");
const { isAuthenticated, isAdmin, isGuest } = require("../middleware/auth");

// Home
router.get("/", HomeController.index);

// Auth
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

router.post("/logout", AuthController.logout);
router.get("/logout", AuthController.logout);
// Sutik
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

router.get("/sutik/:id", SutiController.show);

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

// Contact
router.get("/contact", MessageController.showContactForm);
router.get("/kapcsolat", MessageController.showContactForm);
router.post(
  "/contact",
  [
    body("name").notEmpty().withMessage("A név mező kötelező."),
    body("email").isEmail().withMessage("Érvényes email címet adjon meg."),
    body("message").notEmpty().withMessage("Az üzenet mező kötelező."),
  ],
  MessageController.store
);
router.post(
  "/kapcsolat",
  [
    body("name").notEmpty().withMessage("A név mező kötelező."),
    body("email").isEmail().withMessage("Érvényes email címet adjon meg."),
    body("message").notEmpty().withMessage("Az üzenet mező kötelező."),
  ],
  MessageController.store
);

// Messages
router.get("/messages", isAuthenticated, MessageController.index);
router.get("/uzenetek", isAuthenticated, MessageController.index);

// Diagrams
router.get("/diagrams", DiagramController.index);
router.get("/diagram", DiagramController.index);

// Admin
router.get("/admin", isAdmin, AdminController.dashboard);

module.exports = router;
