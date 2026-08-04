const path = require("path");
const fs = require("fs");

const foliosManager = require("./utils/FoliosManager");

function iniciarSII() {

    const rutaCAF = path.join(
        __dirname,
        "caf",
        "CAF33.xml"
    );

    if (!fs.existsSync(rutaCAF)) {

        console.log("=================================");
        console.log("⚠️ CAF no instalado");
        console.log("Modo desarrollo activado");
        console.log("=================================");

        return;
    }

    try {

        foliosManager.cargarCAF(rutaCAF);

        console.log("=================================");
        console.log("✅ CAF cargado");
        console.log(foliosManager.obtenerCAF());
        console.log("=================================");

    } catch (err) {

        console.error(err);

    }

}

module.exports = iniciarSII;