const mongoose = require("mongoose");
const Item = require("./models/Item");

mongoose.connect("mongodb+srv://database:1357246@cluster0.vfnoc.mongodb.net/InventarioRasiva");

async function run() {

    const result = await Item.updateMany(
        { unidad: { $exists: false } },
        {
            $set: {
                unidad: "m3"
            }
        }
    );

    console.log(result);

    process.exit();
}

run();