const { Suti, Tartalom, Ar } = require("../models");
const { validationResult } = require("express-validator");

class SutiController {
  async index(req, res) {
    try {
      const sutik = await Suti.findAll({
        include: [
          { model: Tartalom, as: "tartalmak" },
          { model: Ar, as: "arak" },
        ],
        order: [["nev", "ASC"]],
      });

      res.render("sutik/index", { title: "Sütemények", sutik });
    } catch (error) {
      console.error("Error loading sutik:", error);
      res.status(500).render("error", {
        message: "Hiba történt a sütemények betöltésekor.",
      });
    }
  }

  async create(req, res) {
    res.render("sutik/create", { title: "Új sütemény hozzáadása", errors: [] });
  }

  async store(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("sutik/create", {
        title: "Új sütemény hozzáadása",
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const { nev, tipus, dijazott, mentes, ar_ertek, ar_egyseg } = req.body;
      const suti = await Suti.create({
        nev,
        tipus,
        dijazott: dijazott ? true : false,
      });

      if (mentes && mentes.trim() !== "") {
        await Tartalom.create({ sutiid: suti.id, mentes: mentes });
      }

      if (ar_ertek && ar_egyseg) {
        await Ar.create({
          sutiid: suti.id,
          ertek: parseInt(ar_ertek),
          egyseg: ar_egyseg,
        });
      }

      res.redirect("/sutik");
    } catch (error) {
      console.error("Error creating suti:", error);
      res.render("sutik/create", {
        title: "Új sütemény hozzáadása",
        errors: [{ msg: "Hiba történt a sütemény létrehozásakor." }],
        oldInput: req.body,
      });
    }
  }

  async edit(req, res) {
    try {
      const suti = await Suti.findByPk(req.params.id, {
        include: [
          { model: Tartalom, as: "tartalmak" },
          { model: Ar, as: "arak" },
        ],
      });

      if (!suti) {
        return res
          .status(404)
          .render("error", { message: "A sütemény nem található." });
      }

      res.render("sutik/edit", {
        title: "Sütemény szerkesztése",
        suti,
        errors: [],
      });
    } catch (error) {
      console.error("Error loading suti for edit:", error);
      res
        .status(500)
        .render("error", { message: "Hiba történt a sütemény betöltésekor." });
    }
  }

  async update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const suti = await Suti.findByPk(req.params.id, {
        include: [
          { model: Tartalom, as: "tartalmak" },
          { model: Ar, as: "arak" },
        ],
      });
      return res.render("sutik/edit", {
        title: "Sütemény szerkesztése",
        suti,
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const { nev, tipus, dijazott, mentes, ar_ertek, ar_egyseg } = req.body;
      const suti = await Suti.findByPk(req.params.id);

      if (!suti) {
        return res
          .status(404)
          .render("error", { message: "A sütemény nem található." });
      }

      await suti.update({ nev, tipus, dijazott: dijazott ? true : false });
      await Tartalom.destroy({ where: { sutiid: suti.id } });
      if (mentes && mentes.trim() !== "") {
        await Tartalom.create({ sutiid: suti.id, mentes: mentes });
      }

      await Ar.destroy({ where: { sutiid: suti.id } });
      if (ar_ertek && ar_egyseg) {
        await Ar.create({
          sutiid: suti.id,
          ertek: parseInt(ar_ertek),
          egyseg: ar_egyseg,
        });
      }

      res.redirect("/sutik");
    } catch (error) {
      console.error("Error updating suti:", error);
      const suti = await Suti.findByPk(req.params.id, {
        include: [
          { model: Tartalom, as: "tartalmak" },
          { model: Ar, as: "arak" },
        ],
      });
      res.render("sutik/edit", {
        title: "Sütemény szerkesztése",
        suti,
        errors: [{ msg: "Hiba történt a sütemény frissítésekor." }],
        oldInput: req.body,
      });
    }
  }

  async destroy(req, res) {
    try {
      const suti = await Suti.findByPk(req.params.id);
      if (!suti) {
        return res
          .status(404)
          .render("error", { message: "A sütemény nem található." });
      }

      await Tartalom.destroy({ where: { sutiid: suti.id } });
      await Ar.destroy({ where: { sutiid: suti.id } });
      await suti.destroy();
      res.redirect("/sutik");
    } catch (error) {
      console.error("Error deleting suti:", error);
      res
        .status(500)
        .render("error", { message: "Hiba történt a sütemény törlésekor." });
    }
  }
}

module.exports = new SutiController();
