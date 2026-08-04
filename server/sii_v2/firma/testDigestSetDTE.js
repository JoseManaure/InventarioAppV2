const fs = require("fs");
const crypto = require("crypto");
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");


const xml = fs.readFileSync(
    "xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_39.xml",
    "utf8"
);


const doc = new DOMParser().parseFromString(xml);


const setDTE =
    doc.getElementsByTagName("SetDTE")[0];


const serializer = new XMLSerializer();

const contenido =
    serializer.serializeToString(setDTE);


const hash =
    crypto
        .createHash("sha1")
        .update(contenido)
        .digest("base64");


console.log("HASH ACTUAL SETDTE:");
console.log(hash);