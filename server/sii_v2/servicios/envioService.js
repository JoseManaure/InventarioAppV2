const fs = require("fs");
const path = require("path");

function generarEnvioDTE({
    empresa,
    empresaDB,
    xmlFirmado,
    tipoDTE,
    folio
}) {

    // quitar cabecera XML del DTE
    xmlFirmado = xmlFirmado
        .replace(/^<\?xml[^>]*\?>\s*/i, "");

    console.log("================================");
    console.log("XML QUE LLEGA A generarEnvioDTE");
    console.log("================================");
    console.log(xmlFirmado);
    console.log("================================");

    const envio = `<?xml version="1.0" encoding="UTF-8"?>

<EnvioDTE
xmlns="http://www.sii.cl/SiiDte"
version="1.0">

<SetDTE ID="SetDoc">

<Caratula version="1.0">

<RutEmisor>${empresaDB.rut}</RutEmisor>

<RutEnvia>${empresaDB.rut}</RutEnvia>

<RutReceptor>60803000-K</RutReceptor>

<FchResol>${empresaDB.fechaResolucion || "2026-01-01"}</FchResol>

<NroResol>${empresaDB.numeroResolucion || 0}</NroResol>
<TmstFirmaEnv>${new Date().toISOString().substring(0, 19)}</TmstFirmaEnv>

<SubTotDTE>

<TpoDTE>${tipoDTE}</TpoDTE>

<NroDTE>1</NroDTE>

</SubTotDTE>

</Caratula>

${xmlFirmado}

</SetDTE>

</EnvioDTE>`;

    const carpeta = path.join(
        __dirname,
        "..",
        "xml_generados"
    );

    if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta, {
            recursive: true
        });
    }

    const ruta = path.join(
        carpeta,
        `ENVIO_${empresa}_${folio}.xml`
    );

    fs.writeFileSync(
        ruta,
        Buffer.from(envio, "latin1")
    );

    console.log(
        "HASH ENVIO GENERADO:"
    );

    const crypto = require("crypto");

    console.log(
        crypto
            .createHash("sha1")
            .update(envio)
            .digest("base64")
    );
    return ruta;
}

module.exports = {
    generarEnvioDTE
};