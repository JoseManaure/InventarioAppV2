const path = require("path");

module.exports = {

    ambiente: process.env.SII_AMBIENTE || "certificacion",

    empresa: {

        rut: process.env.SII_RUT || "5586794-1",

        razonSocial: process.env.SII_RAZON_SOCIAL || "ARIDOS SERGIO SILVA",

        giro: process.env.SII_GIRO || "VENTA DE ÁRIDOS",

        direccion: process.env.SII_DIRECCION || "Balmaceda 01091",

        comuna: process.env.SII_COMUNA || "Peñaflor",

        ciudad: process.env.SII_CIUDAD || "Santiago",

        actividadEconomica: process.env.SII_ACTIVIDAD || "Venta materiales"

    },

    certificado: {

        path: path.join(
            __dirname,
            "certificados",
            "certificado.pfx"
        ),

        password: process.env.CERT_PASSWORD || ""

    }

};