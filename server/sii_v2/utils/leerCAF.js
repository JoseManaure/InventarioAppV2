const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");


async function leerCAF(nombreArchivo) {

    const ruta = path.join(
        __dirname,
        "..",
        "caf",
        nombreArchivo
    );


    const xml = fs.readFileSync(
        ruta,
        "utf8"
    );


    const resultado =
        await xml2js.parseStringPromise(xml);


    const da =
        resultado.CAF.DA[0];


    return {

        rut: da.RE[0],

        razonSocial: da.RS[0],

        tipoDTE: Number(da.TD[0]),

        folioInicial:
            Number(da.RNG[0].D[0]),

        folioFinal:
            Number(da.RNG[0].H[0]),

        fecha:
            da.FA[0]

    };

}


module.exports = leerCAF;