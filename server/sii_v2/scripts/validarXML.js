const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");


const archivo =
    "./sii_v2/xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_20.xml";


const xml =
    fs.readFileSync(
        archivo,
        "utf8"
    );


const parser = new XMLParser({
    ignoreAttributes: false
});


try {

    const json =
        parser.parse(xml);

    console.log("✅ XML válido");

    console.log(
        Object.keys(json)
    );


}
catch (error) {

    console.log("❌ XML inválido");

    console.log(error);

}