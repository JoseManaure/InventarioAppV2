const mongoose = require("mongoose");

const Empresa = require("../models/Empresa");

const {
    obtenerCAF
} = require("./servicios/cafService");


require("dotenv").config();


async function cargar() {


    await mongoose.connect(
        process.env.MONGO_URI
    );


    const empresa =
        await Empresa.findById(
            "6a42dcd1d1b206ea01771e72"
        );


    const caf =
        await obtenerCAF(
            "caf-demo.xml"
        );



    empresa.caf = {

        archivo: "caf-demo.xml",

        tipoDTE: caf.tipoDTE,

        desde: caf.folioInicial,

        hasta: caf.folioFinal,

        actual: caf.folioInicial,

        fechaCarga: new Date()

    };


    await empresa.save();


    console.log(
        "CAF cargado",
        empresa.caf
    );


    process.exit();

}


cargar();