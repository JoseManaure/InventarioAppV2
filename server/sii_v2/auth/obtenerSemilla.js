const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");
const ENDPOINTS = require("../endpoints");

async function obtenerSemilla() {

    const soap = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
<soapenv:Body>
<getSeed/>
</soapenv:Body>
</soapenv:Envelope>`;

    const response = await axios.post(
        ENDPOINTS.CR_SEED,
        soap,
        {
            headers: {
                "Content-Type": "text/xml;charset=UTF-8",
                SOAPAction: ""
            }
        }
    );

    const parser = new XMLParser({
        ignoreAttributes: false,
        trimValues: true,
        parseTagValue: false
    });
    const soapObj = parser.parse(response.data);

    const xmlInterno =
        soapObj["soapenv:Envelope"]
            ?.["soapenv:Body"]
            ?.getSeedResponse
            ?.getSeedReturn;

    if (!xmlInterno) {
        throw new Error("El SII no devolvió una semilla.");
    }

    const xmlRespuesta =
        typeof xmlInterno === "string"
            ? xmlInterno
            : xmlInterno["#text"];

    const respuesta = parser.parse(xmlRespuesta);
    console.dir(respuesta, { depth: null });
    console.log("===== XML INTERNO =====");
    console.log(xmlInterno);
    console.log("=======================");
    console.log(typeof xmlInterno);

    const estado =
        respuesta["SII:RESPUESTA"]["SII:RESP_HDR"].ESTADO;

    if (estado !== "00") {
        throw new Error(
            `SII respondió estado ${estado}`
        );
    }

    return {
        estado,
        semilla:
            respuesta["SII:RESPUESTA"]
            ["SII:RESP_BODY"]
                .SEMILLA
    };
}

module.exports = obtenerSemilla;