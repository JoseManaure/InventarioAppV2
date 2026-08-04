// services/sii/consultarEstadoEnvio.js

const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");
const ENDPOINTS = require("../../endpoints");

/**
 * Consulta el estado de un envío DTE al SII usando su Track ID.
 *
 * @param {Object} params
 * @param {String} params.rutCompania - RUT de la empresa SIN dígito verificador (ej. "76123456")
 * @param {String} params.dvCompania - dígito verificador (ej. "7")
 * @param {String} params.trackId - Track ID devuelto por el Upload
 * @param {String} params.token - token de autenticación vigente (obtenido con getTokenFromSeed)
 */
async function consultarEstadoEnvio({ rutCompania, dvCompania, trackId, token }) {

    const soap = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Body>
        <getEstUp xmlns="https://maullin.sii.cl/DTEWS/QueryEstUp.jws" soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <RutCompania xsi:type="xsd:string">${rutCompania}</RutCompania>
            <DvCompania xsi:type="xsd:string">${dvCompania}</DvCompania>
            <TrackId xsi:type="xsd:string">${trackId}</TrackId>
            <Token xsi:type="xsd:string">${token}</Token>
        </getEstUp>
    </soapenv:Body>
</soapenv:Envelope>`;

    console.log("📡 Consultando estado de envío...");
    console.log("Track ID:", trackId);

    const response = await axios.post(

        ENDPOINTS.QUERY_EST_UP,

        soap,

        {
            headers: {
                "Content-Type": "text/xml;charset=UTF-8",
                SOAPAction: ""
            },
            timeout: 30000
        }

    );

    const parser = new XMLParser({
        ignoreAttributes: false,
        trimValues: true
    });

    const resultadoSOAP = parser.parse(response.data);

    // La respuesta viene como string XML dentro de getEstUpReturn, hay que parsear dos veces
    const xmlInterno =
        resultadoSOAP?.["soapenv:Envelope"]
        ?.["soapenv:Body"]
        ?.["getEstUpResponse"]
        ?.["getEstUpReturn"];

    if (!xmlInterno) {
        throw new Error(
            "No se pudo extraer la respuesta interna del SII. Respuesta cruda: " +
            JSON.stringify(resultadoSOAP)
        );
    }

    const textoXML =
        typeof xmlInterno === "object"
            ? xmlInterno["#text"]
            : xmlInterno;

    const resultado = parser.parse(textoXML);

    const hdr = resultado?.["SII:RESPUESTA"]?.["SII:RESP_HDR"];
    const body = resultado?.["SII:RESPUESTA"]?.["SII:RESP_BODY"];

    return {

        estado: hdr?.ESTADO,
        glosa: hdr?.GLOSA,
        trackId: hdr?.TRACKID,
        numAtencion: hdr?.NUM_ATENCION,

        tipoDocumento: body?.TIPO_DOCTO,
        informados: body?.INFORMADOS,
        aceptados: body?.ACEPTADOS,
        rechazados: body?.RECHAZADOS,
        reparos: body?.REPAROS,

        crudo: resultado

    };

}

module.exports = { consultarEstadoEnvio };