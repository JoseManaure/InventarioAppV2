const fs = require("fs");
const crypto = require("crypto");
const { SignedXml } = require("xml-crypto");


const xml = fs.readFileSync(
    "xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_39.xml",
    "utf8"
);


const sig = new SignedXml();


// cargar el XML dentro de xml-crypto
sig.loadSignature(
    xml
);


const references =
    sig.getReferences();


console.log("REFERENCIAS:");
console.log(references);


const digest =
    references[0].digestValue;


console.log(
    "DIGEST GUARDADO:"
);

console.log(digest);