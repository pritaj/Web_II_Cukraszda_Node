const sequelize = require("./config/database");
const bcrypt = require("bcryptjs");
const { User, Suti, Tartalom, Ar, Message } = require("./models");

async function setupDatabase() {
  try {
    console.log("🔄 Adatbázis inicializálása...");

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
    console.log("✓ Teszt felhasználó létrehozva (user@cukraszda.hu / user123)");

    // Sample sutik data
    const sutikData = [
      { nev: "Dobos torta", tipus: "torta", dijazott: true },
      { nev: "Eszterházy szelet", tipus: "tortaszelet", dijazott: false },
      { nev: "Sajtos pogácsa", tipus: "sós teasütemény", dijazott: false },
      { nev: "Túrós batyu", tipus: "édes teasütemény", dijazott: false },
      { nev: "Almás pite", tipus: "pite", dijazott: false },
      { nev: "Somlói galuska", tipus: "tejszínes sütemény", dijazott: true },
      { nev: "Gesztenyepüré", tipus: "vegyes", dijazott: false },
      { nev: "Linzer karika", tipus: "édes teasütemény", dijazott: false },
    ];

    for (const sutiData of sutikData) {
      const suti = await Suti.create(sutiData);

      // Add random tartalom
      if (Math.random() > 0.5) {
        await Tartalom.create({
          sutiid: suti.id,
          mentes: ["G", "L", "TM"][Math.floor(Math.random() * 3)],
        });
      }

      // Add random ar
      await Ar.create({
        sutiid: suti.id,
        ertek: Math.floor(Math.random() * 2000) + 500,
        egyseg: ["db", "szelet", "kg"][Math.floor(Math.random() * 3)],
      });
    }
    console.log("✓ Sütemények létrehozva");

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

    console.log("✓ Üzenetek létrehozva");
    console.log("\n✅ Adatbázis sikeresen inicializálva!");
    console.log("\nBejelentkezési adatok:");
    console.log("Admin: admin@cukraszda.hu / admin123");
    console.log("User: user@cukraszda.hu / user123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Hiba történt:", error);
    process.exit(1);
  }
}

setupDatabase();
