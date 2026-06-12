const { create } = require('xmlbuilder2');

function generarBoletaXML(data) {

    const xml = create({ version: '1.0', encoding: 'ISO-8859-1' })
        .ele('DTE', { version: '1.0' })

        .ele('Documento')

        .ele('Encabezado')

        .ele('IdDoc')
        .ele('TipoDTE').txt('39').up()
        .ele('Folio').txt(data.folio).up()
        .up()

        .ele('Emisor')
        .ele('RUTEmisor')
        .txt(data.rutEmpresa)
        .up()

        .ele('RznSoc')
        .txt(data.razonSocial)
        .up()
        .up()

        .ele('Receptor')
        .ele('RUTRecep')
        .txt(data.rutCliente)
        .up()

        .ele('RznSocRecep')
        .txt(data.cliente)
        .up()
        .up()

        .ele('Totales')
        .ele('MntTotal')
        .txt(data.total)
        .up()
        .up()

        .up()

        .up()

        .up();

    return xml.end({ prettyPrint: true });
}

module.exports = generarBoletaXML;