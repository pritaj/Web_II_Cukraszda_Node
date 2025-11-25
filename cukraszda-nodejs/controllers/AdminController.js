const { Suti, Tartalom, Ar, Message, User } = require("../models");
const { Op } = require("sequelize");

class AdminController {
  async dashboard(req, res) {
    try {
      const sutiCount = await Suti.count();
      const messageCount = await Message.count();
      const userCount = await User.count();
      const dijazottCount = await Suti.count({ where: { dijazott: true } });

      const sutikByType = await Suti.findAll({
        attributes: ["tipus"],
        group: ["tipus"],
      });

      const typeData = {};
      for (const suti of sutikByType) {
        const count = await Suti.count({ where: { tipus: suti.tipus } });
        typeData[suti.tipus] = count;
      }

      const recentMessages = await Message.findAll({
        limit: 5,
        order: [["created_at", "DESC"]],
      });

      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        stats: {
          sutiCount,
          messageCount,
          userCount,
          dijazottCount,
        },
        typeData,
        recentMessages,
      });
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
      res.status(500).render("error", {
        message: "Hiba történt az admin oldal betöltésekor.",
      });
    }
  }

  async diagrams(req, res) {
    try {
      const sutikByType = await Suti.findAll({
        attributes: ["tipus"],
        group: ["tipus"],
      });

      const typeData = {};
      for (const suti of sutikByType) {
        const count = await Suti.count({ where: { tipus: suti.tipus } });
        typeData[suti.tipus] = count;
      }

      const dijazottCount = await Suti.count({ where: { dijazott: true } });
      const notDijazottCount = await Suti.count({ where: { dijazott: false } });

      const avgPricesByType = {};
      for (const tipus in typeData) {
        const sutik = await Suti.findAll({
          where: { tipus },
          include: [{ model: Ar, as: "arak" }],
        });

        let totalPrice = 0;
        let count = 0;
        sutik.forEach((suti) => {
          if (suti.arak && suti.arak.length > 0) {
            suti.arak.forEach((ar) => {
              totalPrice += ar.ertek;
              count++;
            });
          }
        });

        avgPricesByType[tipus] = count > 0 ? Math.round(totalPrice / count) : 0;
      }

      res.render("admin/diagrams", {
        title: "Diagramok",
        typeData,
        dijazottData: {
          dijazott: dijazottCount,
          notDijazott: notDijazottCount,
        },
        avgPricesByType,
      });
    } catch (error) {
      console.error("Error loading diagrams:", error);
      res.status(500).render("error", {
        message: "Hiba történt a diagramok betöltésekor.",
      });
    }
  }
}

module.exports = new AdminController();
