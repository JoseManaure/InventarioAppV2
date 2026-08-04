// services/xml/generarTED.js

const crypto = require("crypto");
const fs = require("fs");

/**
 * Carga el CAF desde un archivo XML descargado del SII
 * y extrae los datos necesarios para generar el TED.
 */
function cargarCAF(rutaCAF) {

    const xmlCAF = fs.readFileSync(rutaCAF, "utf8");

    // Extraemos el bloque <CAF>...</CAF> completo (va embebido tal cual en el TED)
    const matchCAF = xmlCAF.match(/<CAF[\s\S]*?<\/CAF>/);
    if (!matchCAF) {
        throw new Error("No se encontró el bloque <CAF> en el archivo.");
    }
    const cafBloque = matchCAF[0];

    // Extraemos la clave privada RSA (RSASK)
    const matchSK = xmlCAF.match(/<RSASK>([\s\S]*?)<\/RSASK>/);
    if (!matchSK) {
        throw new Error("No se encontró <RSASK> (clave privada) en el CAF.");
    }
    const privateKey = matchSK[1].trim();

    // Extraemos datos de rango de folios y RUT, útiles para validar
    const desdeFolio = parseInt((xmlCAF.match(/<D>(\d+)<\/D>/) || [])[1], 10);
    const hastaFolio = parseInt((xmlCAF.match(/<H>(\d+)<\/H>/) || [])[1], 10);
    const rutEmisorCAF = (xmlCAF.match(/<RE>([^<]+)<\/RE>/) || [])[1];
    const tipoDTECAF = parseInt((xmlCAF.match(/<TD>(\d+)<\/TD>/) || [])[1], 10);

    return {
        cafBloque,
        privateKey,
        desdeFolio,
        hastaFolio,
        rutEmisorCAF,
        tipoDTECAF
    };
}

/**
 * Genera el TED (Timbre Electrónico) firmado con la clave privada del CAF.
 *
 * @param {Object} dte - objeto con los datos del documento (mismo shape que usas en generarXMLDTE)
 * @param {String} rutaCAF - ruta al archivo CAF.xml descargado del SII
 */
function generarTED(dte, rutaCAF) {

    const {
        cafBloque,
        privateKey,
        desdeFolio,
        hastaFolio,
        rutEmisorCAF,
        tipoDTECAF
    } = cargarCAF(rutaCAF);

    const folio = dte.encabezado.folio;
    const tipoDTE = dte.encabezado.tipoDTE;

    // Validación: el folio debe estar dentro del rango autorizado por este CAF
    if (folio < desdeFolio || folio > hastaFolio) {
        throw new Error(
            `Folio ${folio} fuera del rango autorizado por el CAF (${desdeFolio}-${hastaFolio}).`
        );
    }

    if (tipoDTE !== tipoDTECAF) {
        throw new Error(
            `El CAF es para tipo de documento ${tipoDTECAF}, pero se intenta timbrar tipo ${tipoDTE}.`
        );
    }

    const fechaEmision = new Date(dte.encabezado.fecha)
        .toISOString()
        .substring(0, 10);

    const primerItem = dte.detalle[0]
        ? dte.detalle[0].nombre
        : "";

    const timestamp = new Date().toISOString();

    // Bloque DD sin firmar todavía
    const dd = `<DD>
<RE>${rutEmisorCAF}</RE>
<TD>${tipoDTE}</TD>
<F>${folio}</F>
<FE>${fechaEmision}</FE>
<RR>${dte.encabezado.receptor.rut}</RR>
<RSR>${dte.encabezado.receptor.nombre}</RSR>
<MNT>${dte.totales.total}</MNT>
<IT1>${primerItem}</IT1>
${cafBloque}
<TSTED>${timestamp}</TSTED>
</DD>`;

    // Firma RSA-SHA1 directa sobre el bloque DD (NO es XMLDSig, es firma simple)
    const signer = crypto.createSign("RSA-SHA1");
    signer.update(dd, "utf8");
    signer.end();

    const firma = signer.sign(privateKey, "base64");

    const ted = `<TED version="1.0">
${dd}
<FRMT algoritmo="SHA1withRSA">${firma}</FRMT>
</TED>`;

    return ted;
}

module.exports = { generarTED, cargarCAF };