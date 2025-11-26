const { Suti } = require("../models");
const { fn, col, Op } = require("sequelize");
class DiagramController {
  async index(req, res) {
    try {
      // Sütemények típus szerint csoportosítva
      const tipusok = await Suti.findAll({
        attributes: ["tipus", [fn("COUNT", col("id")), "count"]],
        group: ["tipus"],
        raw: true,
      });

      // Díjazott sütemények száma
      const dijazott = await Suti.count({
        where: {
          dijazott: { [Op.ne]: 0 },
        },
      });

      const nemDijazott = await Suti.count({
        where: {
          dijazott: 0,
        },
      });

      res.render("diagram", {
        title: "Diagramok",
        tipusok,
        dijazott,
        nemDijazott,
      });
    } catch (error) {
      console.error("Error loading diagram data:", error);
      res.status(500).render("error", {
        message: "Hiba történt a diagramok betöltésekor.",
      });
    }
  }
}

module.exports = new DiagramController();
