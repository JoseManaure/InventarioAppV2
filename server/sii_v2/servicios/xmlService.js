const fs = require("fs");
const path = require("path");


function guardarXML({
    xml,
    empresa,
    tipoDTE,
    folio
}) {


    const carpeta = path.join(
        __dirname,
        "..",
        "xml_generados"
    );


    if (!fs.existsSync(carpeta)) {

        fs.mkdirSync(
            carpeta,
            {
                recursive: true
            }
        );

    }


    const nombreArchivo =
        `${empresa}_${tipoDTE}_${folio}.xml`;


    const ruta =
        path.join(
            carpeta,
            nombreArchivo
        );


    fs.writeFileSync(
        ruta,
        xml,
        "utf8"
    );


    console.log(
        "✅ XML guardado:",
        ruta
    );


    return ruta;

}


module.exports = {
    guardarXML
};