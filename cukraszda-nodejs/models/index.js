const Suti = require("./Suti");
const Tartalom = require("./Tartalom");
const Ar = require("./Ar");
const User = require("./User");
const Message = require("./Message");

// Define relationships
Suti.hasMany(Tartalom, { foreignKey: "sutiid", as: "tartalmak" });
Tartalom.belongsTo(Suti, { foreignKey: "sutiid", as: "suti" });

Suti.hasMany(Ar, { foreignKey: "sutiid", as: "arak" });
Ar.belongsTo(Suti, { foreignKey: "sutiid", as: "suti" });

module.exports = {
  Suti,
  Tartalom,
  Ar,
  User,
  Message,
};
