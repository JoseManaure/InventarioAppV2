function generarXMLBoleta(dte) {
    const detalleXML = dte.detalle.map(item => `
        <Detalle>
            <NroLinDet>${item.linea}</NroLinDet>
            <NmbItem>${item.nombre}</NmbItem>
            <QtyItem>${item.cantidad}</QtyItem>
            <PrcItem>${item.precio}</PrcItem>
            <MontoItem>${item.total}</MontoItem>
        </Detalle>
    `).join('');

    return `<DTE xmlns="http://www.sii.cl/SiiDte" version="1.0">
    <Documento ID="F${dte.encabezado.folio}T${dte.encabezado.tipoDTE}">
        <Encabezado>
            <IdDoc>
                <TipoDTE>${dte.encabezado.tipoDTE}</TipoDTE>
                <Folio>${dte.encabezado.folio}</Folio>
                <FchEmis>${new Date(dte.encabezado.fecha).toISOString().slice(0, 10)}</FchEmis>
            </IdDoc>

            <Emisor>
                <RUTEmisor>${dte.encabezado.emisor.rut || ''}</RUTEmisor>
                <RznSoc>${dte.encabezado.emisor.razonSocial || ''}</RznSoc>
                <GiroEmis>${dte.encabezado.emisor.giro || ''}</GiroEmis>
                <DirOrigen>${dte.encabezado.emisor.direccion || ''}</DirOrigen>
                <CmnaOrigen>${dte.encabezado.emisor.comuna || ''}</CmnaOrigen>
                <CiudadOrigen>${dte.encabezado.emisor.ciudad || ''}</CiudadOrigen>
            </Emisor>

            <Receptor>
                <RUTRecep>${dte.encabezado.receptor.rut}</RUTRecep>
                <RznSocRecep>${dte.encabezado.receptor.nombre}</RznSocRecep>
            </Receptor>

            <Totales>
                <MntNeto>${dte.totales.neto}</MntNeto>
                <IVA>${dte.totales.iva}</IVA>
                <MntTotal>${dte.totales.total}</MntTotal>
            </Totales>
        </Encabezado>

        ${detalleXML}
    </Documento>
</DTE>`;
}

module.exports = { generarXMLBoleta };