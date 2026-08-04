function construirEnvioDTE({

    rutEmisor,

    rutEnvia,

    rutReceptor = "60803000-K",

    resolucionNumero = "0",

    resolucionFecha = "2026-01-01",

    dteXML,

    tipoDTE

}) {

    const fecha = new Date()
        .toISOString()
        .substring(0, 10);

    return `<?xml version="1.0" encoding="ISO-8859-1"?>

<EnvioDTE
    xmlns="http://www.sii.cl/SiiDte"
    version="1.0">

<SetDTE ID="SetDoc">

<Caratula version="1.0">

<RutEmisor>${rutEmisor}</RutEmisor>

<RutEnvia>${rutEnvia}</RutEnvia>

<RutReceptor>${rutReceptor}</RutReceptor>

<FchResol>${resolucionFecha}</FchResol>

<NroResol>${resolucionNumero}</NroResol>

<TmstFirmaEnv>${fecha}T12:00:00</TmstFirmaEnv>

<SubTotDTE>

<TpoDTE>${tipoDTE}</TpoDTE>

<NroDTE>1</NroDTE>

</SubTotDTE>

</Caratula>

${dteXML}

</SetDTE>

</EnvioDTE>`;

}

module.exports = {

    construirEnvioDTE

};