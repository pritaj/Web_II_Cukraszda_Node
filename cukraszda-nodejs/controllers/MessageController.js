const { Message } = require("../models");
const { validationResult } = require("express-validator");

class MessageController {
  showContactForm(req, res) {
    res.render("contact", {
      title: "Kapcsolat",
      errors: [],
      success: false,
    });
  }

  async store(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("contact", {
        title: "Kapcsolat",
        errors: errors.array(),
        success: false,
        oldInput: req.body,
      });
    }

    try {
      const { name, email, message } = req.body;
      await Message.create({
        name,
        email,
        message,
        created_at: new Date(),
      });

      res.render("contact", {
        title: "Kapcsolat",
        errors: [],
        success: true,
        oldInput: {},
      });
    } catch (error) {
      console.error("Error saving message:", error);
      res.render("contact", {
        title: "Kapcsolat",
        errors: [{ msg: "Hiba történt az üzenet mentésekor." }],
        success: false,
        oldInput: req.body,
      });
    }
  }

  async index(req, res) {
    try {
      const messages = await Message.findAll({
        order: [["created_at", "DESC"]],
      });

      res.render("messages/index", {
        title: "Üzenetek",
        messages,
      });
    } catch (error) {
      console.error("Error loading messages:", error);
      res.status(500).render("error", {
        message: "Hiba történt az üzenetek betöltésekor.",
      });
    }
  }
}

module.exports = new MessageController();
