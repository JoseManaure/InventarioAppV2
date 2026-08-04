function insertarTED(xml, tedXML) {

    const nuevoXML = xml.replace(
        /<\/Documento>\s*<\/DTE>/,
        `${tedXML}
</Documento>
</DTE>`
    );

    if (nuevoXML === xml) {

        console.log("❌ TED NO INSERTADO");

    } else {

        console.log("✅ TED INSERTADO");

    }

    return nuevoXML;

}


module.exports = {
    insertarTED
};