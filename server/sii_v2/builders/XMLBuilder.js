const { create } = require("xmlbuilder2");

function generarXMLDTE(dte) {

    const doc = create({

        version: "1.0",

        encoding: "ISO-8859-1"

    });

    const xml = doc
        .ele("DTE", {

            xmlns: "http://www.sii.cl/SiiDte",

            version: "1.0"

        })

        .ele("Documento", {

            ID: `F${dte.encabezado.folio}T${dte.encabezado.tipoDTE}`

        });

    // ==========================
    // ENCABEZADO
    // ==========================

    const encabezado = xml.ele("Encabezado");

    const idDoc = encabezado.ele("IdDoc");

    idDoc.ele("TipoDTE").txt(
        String(dte.encabezado.tipoDTE)
    );

    idDoc.ele("Folio").txt(
        String(dte.encabezado.folio)
    );

    idDoc.ele("FchEmis").txt(
        new Date(dte.encabezado.fecha)
            .toISOString()
            .substring(0, 10)
    );

    // ==========================
    // EMISOR
    // ==========================

    const emisor = encabezado.ele("Emisor");

    emisor.ele("RUTEmisor")
        .txt(dte.encabezado.emisor.rut);

    emisor.ele("RznSoc")
        .txt(dte.encabezado.emisor.razonSocial);

    emisor.ele("GiroEmis")
        .txt(dte.encabezado.emisor.giro);

    emisor.ele("DirOrigen")
        .txt(dte.encabezado.emisor.direccion);

    emisor.ele("CmnaOrigen")
        .txt(dte.encabezado.emisor.comuna);

    emisor.ele("CiudadOrigen")
        .txt(dte.encabezado.emisor.ciudad);

    // ==========================
    // RECEPTOR
    // ==========================

    const receptor = encabezado.ele("Receptor");

    receptor.ele("RUTRecep")
        .txt(dte.encabezado.receptor.rut);

    receptor.ele("RznSocRecep")
        .txt(dte.encabezado.receptor.nombre);

    // ==========================
    // TOTALES
    // ==========================

    const totales = encabezado.ele("Totales");

    totales.ele("MntNeto")
        .txt(String(dte.totales.neto));

    totales.ele("IVA")
        .txt(String(dte.totales.iva));

    totales.ele("MntTotal")
        .txt(String(dte.totales.total));

    // ==========================
    // DETALLE
    // ==========================

    dte.detalle.forEach(item => {

        const det = xml.ele("Detalle");

        det.ele("NroLinDet")
            .txt(String(item.linea));

        det.ele("NmbItem")
            .txt(item.nombre);

        det.ele("QtyItem")
            .txt(String(item.cantidad));

        det.ele("PrcItem")
            .txt(String(item.precio));

        det.ele("MontoItem")
            .txt(String(item.total));

    });

    return doc.end({

        prettyPrint: true

    });

}

module.exports = {

    generarXMLDTE

};