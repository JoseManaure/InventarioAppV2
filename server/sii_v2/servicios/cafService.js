const path = require("path");

const leerCAF = require("../utils/leerCAF");


async function obtenerCAF(archivo) {


    const caf = await leerCAF(
        archivo
    );


    return caf;

}


module.exports = {
    obtenerCAF
};