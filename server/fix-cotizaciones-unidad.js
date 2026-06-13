require("dotenv").config();

const mongoose = require("mongoose");
const Cotizacion = require("./models/Cotizacion");

mongoose.connect(process.env.MONGO_URI);

async function run() {

    const cotizaciones = await Cotizacion.find({
        "productos.unidad": "mts3"
    });

    for (const cot of cotizaciones) {

        cot.productos = cot.productos.map(p => {

            if (p.unidad === "mts3") {
                p.unidad = "m3";
            }

            return p;
        });

        await cot.save();
    }

    console.log("✅ Cotizaciones corregidas:", cotizaciones.length);

    process.exit();
}

run();