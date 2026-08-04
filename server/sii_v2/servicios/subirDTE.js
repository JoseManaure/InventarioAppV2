// services/sii/subirDTE.js

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { XMLParser } = require("fast-xml-parser");

const ENDPOINT_UPLOAD_CERTIFICACION =
    "https://maullin.sii.cl/cgi_dte/UPL/DTEUpload";

const ENDPOINT_UPLOAD_PRODUCCION =
    "https://palena.sii.cl/cgi_dte/UPL/DTEUpload";

/**
 * Envía un EnvioDTE firmado al SII usando el token de autenticación.
 *
 * @param {String} rutaArchivoEnvioFirmado - ruta al archivo .xml del EnvioDTE ya firmado
 * @param {String} token - token obtenido de getTokenFromSeed (firmarSemilla + obtenerToken)
 * @param {String} rutEmpresa - RUT de la empresa emisora, sin puntos, con guión (ej. "76123456-7")
 * @param {Object} opciones
 * @param {Boolean} opciones.produccion - si true, usa el endpoint de producción; si false (default), certificación
 */
async function subirDTE(rutaArchivoEnvioFirmado, token, rutEmpresa, opciones = {}) {

    const endpoint = opciones.produccion
        ? ENDPOINT_UPLOAD_PRODUCCION
        : ENDPOINT_UPLOAD_CERTIFICACION;

    if (!fs.existsSync(rutaArchivoEnvioFirmado)) {
        throw new Error(
            `No se encontró el archivo a enviar: ${rutaArchivoEnvioFirmado}`
        );
    }

    const [rutSinDigito, dv] = rutEmpresa.split("-");

    const form = new FormData();

    // El SII espera estos campos específicos en el multipart
    form.append("rutSender", rutSinDigito);
    form.append("dvSender", dv);
    form.append("rutCompany", rutSinDigito);
    form.append("dvCompany", dv);

    form.append(
        "archivo",
        fs.createReadStream(rutaArchivoEnvioFirmado),
        {
            filename: "envio.xml",
            contentType: "text/xml"
        }
    );

    console.log("📤 Enviando DTE al SII...");
    console.log("Endpoint:", endpoint);

    const response = await axios.post(endpoint, form, {

        headers: {
            ...form.getHeaders(),
            Cookie: `TOKEN=${token}`
        },

        timeout: 60000

    });

    console.log("===== RESPUESTA UPLOAD RAW =====");
    console.log(response.data);

    const parser = new XMLParser({
        ignoreAttributes: false,
        trimValues: true
    });

    const resultado = parser.parse(response.data);

    // Guardamos la respuesta cruda para debug
    fs.writeFileSync(
        "RESPUESTA_UPLOAD.xml",
        response.data,
        "utf8"
    );

    return resultado;

}

module.exports = { subirDTE };