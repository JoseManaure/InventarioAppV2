require("dotenv").config();

const mongoose = require("mongoose");
const Item = require("./models/Item");

mongoose.connect(process.env.MONGO_URI);

async function run() {

    const result = await Item.updateMany(
        { unidad: "mts3" },
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