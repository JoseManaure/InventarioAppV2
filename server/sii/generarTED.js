const fs = require('fs');
const path = require('path');

function generarTED(dte) {

    const cafPath = path.join(
        __dirname,
        'caf',
        'caf-demo.xml'
    );

    const cafXML = fs.readFileSync(cafPath, 'utf8');

    const ted = `
<TED version="1.0">
  <DD>

    <RE>${dte.encabezado.emisor.rut}</RE>

    <TD>${dte.encabezado.tipoDTE}</TD>

    <F>${dte.encabezado.folio}</F>

    <FE>${new Date()
            .toISOString()
            .split('T')[0]}</FE>

    <RR>${dte.encabezado.receptor.rut}</RR>

    <RSR>${dte.encabezado.receptor.nombre}</RSR>

    <MNT>${dte.totales.total}</MNT>

    ${cafXML}

    <TSTED>${new Date().toISOString()}</TSTED>

  </DD>

  <FRMT algoritmo="SHA1withRSA">
    TIMBRE_DEMO
  </FRMT>
</TED>
`;

    return ted;
}

module.exports = {
    generarTED
};