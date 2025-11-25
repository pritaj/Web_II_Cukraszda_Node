const { Suti, Tartalom, Ar } = require("../models");

class HomeController {
  // Show home page
  async index(req, res) {
    try {
      res.render("home", {
        title: "Főoldal - Cukrászda",
      });
    } catch (error) {
      console.error("Error loading home page:", error);
      res.status(500).render("error", {
        message: "Hiba történt az oldal betöltésekor.",
      });
    }
  }
}

module.exports = new HomeController();
