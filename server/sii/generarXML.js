const { create } = require('xmlbuilder2');
const { generarTED } = require('./generarTED');
function generarXMLBoleta(dte) {
    const ted = generarTED(dte);
    const xmlObj = {
        DTE: {
            Documento: {

                Encabezado: {

                    IdDoc: {
                        TipoDTE: dte.encabezado.tipoDTE,
                        Folio: dte.encabezado.folio,
                        FchEmis: new Date()
                            .toISOString()
                            .split('T')[0]
                    },

                    Emisor: {
                        RUTEmisor: dte.encabezado.emisor.rut,
                        RznSoc: dte.encabezado.emisor.razonSocial,
                        GiroEmis: dte.encabezado.emisor.giro,
                        DirOrigen: dte.encabezado.emisor.direccion,
                        CmnaOrigen: dte.encabezado.emisor.comuna
                    },

                    Receptor: {
                        RUTRecep: dte.encabezado.receptor.rut,
                        RznSocRecep: dte.encabezado.receptor.nombre
                    },

                    Totales: {
                        MntNeto: dte.totales.neto,
                        IVA: dte.totales.iva,
                        MntTotal: dte.totales.total
                    }
                },

                Detalle: dte.detalle.map(item => ({
                    NroLinDet: item.linea,
                    NmbItem: item.nombre,
                    QtyItem: item.cantidad,
                    PrcItem: item.precio,
                    MontoItem: item.total
                })),
                TED: ted
            }
        }
    };

    const xml = create(xmlObj).end({
        prettyPrint: true
    });

    return xml;
}

module.exports = {
    generarXMLBoleta
};