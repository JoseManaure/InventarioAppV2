const mongoose = require("mongoose");

async function run() {
    await mongoose.connect("mongodb://127.0.0.1:27017/tu_db"); // 👈 cambia tu_db

    const items = await mongoose.connection.db
        .collection("items")
        .find({}, { projection: { nombre: 1, codigo: 1 } })
        .toArray();

    console.log("📦 ITEMS EN DB:");
    console.log(items);

    process.exit();
}

run();