const sequelize = require("./config/database");
const bcrypt = require("bcryptjs");
const { User, Suti, Tartalom, Ar, Message } = require("./models");

async function setupDatabase() {
  try {
    console.log(" Adatbázis inicializálása...");

    // Drop and recreate tables
    await sequelize.sync({ force: true });
    console.log("✓ Táblák létrehozva");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@cukraszda.hu",
      password: hashedPassword,
      role: "admin",
    });
    console.log(
      "✓ Admin felhasználó létrehozva (admin@cukraszda.hu / admin123)"
    );

    // Create test user
    const hashedUserPassword = await bcrypt.hash("user123", 10);
    await User.create({
      name: "Teszt Felhasználó",
      email: "user@cukraszda.hu",
      password: hashedUserPassword,
      role: "user",
    });
    console.log("Teszt felhasználó létrehozva (user@cukraszda.hu / user123)");

    // Sample messages
    await Message.create({
      name: "Kiss Anna",
      email: "anna@example.com",
      message: "Nagyon finom a Dobos torta! Köszönöm!",
      created_at: new Date(),
    });

    await Message.create({
      name: "Nagy Péter",
      email: "peter@example.com",
      message: "Szeretnék rendelni 10 darab pogácsát holnapra.",
      created_at: new Date(),
    });

    console.log("Üzenetek létrehozva");
    console.log("\nAdatbázis sikeresen inicializálva!");
    console.log("\nBejelentkezési adatok:");
    console.log("Admin: admin@cukraszda.hu / admin123");
    console.log("User: user@cukraszda.hu / user123\n");

    process.exit(0);
  } catch (error) {
    console.error("Hiba történt:", error);
    process.exit(1);
  }
}

setupDatabase();
