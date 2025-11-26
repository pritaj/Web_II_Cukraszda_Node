const { Suti, Tartalom, Ar } = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

class SutiController {
  // Lista megjelenítése szűrőkkel ÉS LAPOZÁSSAL
  async index(req, res) {
    try {
      const { tipus, mentes, dijazott, page = 1 } = req.query;
      const limit = 12;
      const offset = (parseInt(page) - 1) * limit;
      const where = {};

      if (tipus) where.tipus = tipus;
      if (dijazott) where.dijazott = true;

      let totalCount;
      let sutik;

      if (mentes) {
        const allSutik = await Suti.findAll({
          where,
          include: [
            {
              model: Tartalom,
              as: "tartalmak",
              where: { mentes },
              required: true,
            },
            { model: Ar, as: "arak" },
          ],
          order: [["nev", "ASC"]],
        });
        totalCount = allSutik.length;
        sutik = allSutik.slice(offset, offset + limit);
      } else {
        const result = await Suti.findAndCountAll({
          where,
          include: [
            { model: Tartalom, as: "tartalmak" },
            { model: Ar, as: "arak" },
          ],
          limit,
          offset,
          order: [["nev", "ASC"]],
          distinct: true,
        });
        sutik = result.rows;
        totalCount = result.count;
        console.log("Mentes szűrő nélkül:", totalCount);
      }

      const currentPage = parseInt(page);
      const totalPages = Math.ceil(totalCount / limit);

      const allSutikForTypes = await Suti.findAll({
        attributes: ["tipus"],
        group: ["tipus"],
      });
      const tipusok = allSutikForTypes.map((s) => s.tipus);

      res.render("sutik/index", {
        title: "Sütemények",
        sutik,
        tipusok,
        query: req.query,
        pagination: {
          currentPage,
          totalPages,
          total: totalCount,
          firstItem: offset + 1,
          lastItem: Math.min(offset + limit, totalCount),
          hasPages: totalPages > 1,
          onFirstPage: currentPage === 1,
          hasMorePages: currentPage < totalPages,
        },
      });
    } catch (error) {
      console.error("Error loading sutik:", error);
      res.status(500).render("error", { message: "Hiba történt." });
    }
  }

  // Egy süti megjelenítése
  async show(req, res) {
    try {
      const suti = await Suti.findByPk(req.params.id, {
        include: [
          { model: Tartalom, as: "tartalmak" },
          { model: Ar, as: "arak" },
        ],
      });

      if (!suti) {
        return res.status(404).render("error", {
          message: "A sütemény nem található.",
        });
      }

      res.render("sutik/show", {
        title: suti.nev,
        suti,
      });
    } catch (error) {
      console.error("Error loading suti:", error);
      res.status(500).render("error", {
        message: "Hiba történt a sütemény betöltésekor.",
      });
    }
  }

  // Új süti form
  create(req, res) {
    res.render("sutik/create", {
      title: "Új sütemény",
      errors: [],
      oldInput: {},
    });
  }

  // Új süti mentése
  async store(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("sutik/create", {
        title: "Új sütemény",
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    try {
      const { nev, tipus, dijazott, ar_ertek, ar_egyseg, mentes } = req.body;

      const suti = await Suti.create({
        nev,
        tipus,
        dijazott: dijazott ? true : false, // Magyarország Tortája pipa
      });

      if (mentes && mentes.trim() !== "") {
        await Tartalom.create({
          sutiid: suti.id,
          mentes: mentes,
        });
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
        title: "Új sütemény",
        errors: [{ msg: "Hiba történt a sütemény létrehozásakor." }],
        oldInput: req.body,
      });
    }
  }

  // Szerkesztés form
  async edit(req, res) {
    try {
      const suti = await Suti.findByPk(req.params.id, {
        include: [
          { model: Tartalom, as: "tartalmak" },
          { model: Ar, as: "arak" },
        ],
      });

      if (!suti) {
        return res.status(404).render("error", {
          message: "A sütemény nem található.",
        });
      }

      res.render("sutik/edit", {
        title: "Sütemény szerkesztése",
        suti,
        errors: [],
        oldInput: {},
      });
    } catch (error) {
      console.error("Error loading suti for edit:", error);
      res.status(500).render("error", {
        message: "Hiba történt a sütemény betöltésekor.",
      });
    }
  }

  // Frissítés
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
      const { nev, tipus, dijazott, ar_ertek, ar_egyseg, mentes } = req.body;
      const suti = await Suti.findByPk(req.params.id);

      if (!suti) {
        return res.status(404).render("error", {
          message: "A sütemény nem található.",
        });
      }

      await suti.update({
        nev,
        tipus,
        dijazott: dijazott ? true : false, // checkbox mentése
      });

      // Tartalom (mentes jelölés) újraírva
      await Tartalom.destroy({ where: { sutiid: suti.id } });
      if (mentes && mentes.trim() !== "") {
        await Tartalom.create({
          sutiid: suti.id,
          mentes: mentes,
        });
      }

      // Árak újraírva
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

  // Törlés
  async destroy(req, res) {
    try {
      const suti = await Suti.findByPk(req.params.id);
      if (!suti) {
        return res.status(404).render("error", {
          message: "A sütemény nem található.",
        });
      }

      await Tartalom.destroy({ where: { sutiid: suti.id } });
      await Ar.destroy({ where: { sutiid: suti.id } });
      await suti.destroy();

      res.redirect("/sutik");
    } catch (error) {
      console.error("Error deleting suti:", error);
      res.status(500).render("error", {
        message: "Hiba történt a sütemény törlésekor.",
      });
    }
  }
}

module.exports = new SutiController();
