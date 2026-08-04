const fs = require("fs");
const { SignedXml } = require("xml-crypto");
const { cargarCertificado } = require("./firmaDigital");

const xml = fs.readFileSync(
    "./xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_35.xml",
    "utf8"
);

const { certificate } = cargarCertificado();

const firmas = [
    ...xml.matchAll(
        /<Signature[\s\S]*?<\/Signature>/g
    )
];

console.log("Cantidad de firmas:", firmas.length);

const firmaEnvio = firmas[1][0];

const sig = new SignedXml();

sig.idAttributes = ["ID"];

sig.publicCert = certificate;

sig.loadSignature(firmaEnvio);

const valido = sig.checkSignature(xml);

console.log("==========================");
console.log("VALIDA ENVIO:", valido);
console.log("==========================");

console.log("REFERENCIAS:");
console.dir(sig.references, { depth: null });

console.log("==========================");
console.log("ERRORES:");
console.log(sig.validationErrors);
console.log(sig.validationError);