const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

class AuthController {
  showLoginForm(req, res) {
    res.render("auth/login", {
      title: "Bejelentkezés",
      errors: [],
    });
  }

  showRegisterForm(req, res) {
    res.render("auth/register", {
      title: "Regisztráció",
      errors: [],
    });
  }

  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("auth/register", {
        title: "Regisztráció",
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.render("auth/register", {
          title: "Regisztráció",
          errors: [{ msg: "Ez az email cím már regisztrálva van." }],
          oldInput: req.body,
        });
      }

      const user = await User.create({ name, email, password, role: "user" });
      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;
      res.redirect("/");
    } catch (error) {
      console.error("Registration error:", error);
      res.render("auth/register", {
        title: "Regisztráció",
        errors: [{ msg: "Hiba történt a regisztráció során." }],
        oldInput: req.body,
      });
    }
  }

  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("auth/login", {
        title: "Bejelentkezés",
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.render("auth/login", {
          title: "Bejelentkezés",
          errors: [{ msg: "Hibás email vagy jelszó." }],
          oldInput: req.body,
        });
      }

      const isValidPassword = await user.validPassword(password);
      if (!isValidPassword) {
        return res.render("auth/login", {
          title: "Bejelentkezés",
          errors: [{ msg: "Hibás email vagy jelszó." }],
          oldInput: req.body,
        });
      }

      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;
      const returnTo = req.session.returnTo || "/";
      delete req.session.returnTo;
      res.redirect(returnTo);
    } catch (error) {
      console.error("Login error:", error);
      res.render("auth/login", {
        title: "Bejelentkezés",
        errors: [{ msg: "Hiba történt a bejelentkezés során." }],
        oldInput: req.body,
      });
    }
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.error("Logout error:", err);
      res.redirect("/");
    });
  }
}

module.exports = new AuthController();
