const db = require("../module/db");

async function getSutiByIdWithRelations(id) {
  // 1) Maga a süti
  const [sutiRows] = await db.query(
    "SELECT id, nev, tipus, dijazott FROM suti WHERE id = ?",
    [id]
  );

  if (sutiRows.length === 0) {
    return null;
  }

  const suti = sutiRows[0];

  // 2) Tartalomok (mentes jelzések)
  const [tartalomRows] = await db.query(
    "SELECT id, suti_id, mentes FROM tartalom WHERE suti_id = ?",
    [id]
  );

  // 3) Árak
  const [arRows] = await db.query(
    "SELECT id, suti_id, egyseg, ertek FROM ar WHERE suti_id = ?",
    [id]
  );

  suti.tartalom = tartalomRows;
  suti.arak = arRows;

  return suti;
}

module.exports = {
  getSutiByIdWithRelations,
};
