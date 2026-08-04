const fs = require("fs");
const crypto = require("crypto");
const { SignedXml } = require("xml-crypto");


const xml =
    fs.readFileSync(
        "./xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_29.xml",
        "utf8"
    );


const firma =
    xml.match(
        /<Signature[\s\S]*?<\/Signature>/
    )[0];


const digestEsperado =
    firma.match(
        /<DigestValue>(.*?)<\/DigestValue>/
    )[1];


console.log(
    "Digest XML:",
    digestEsperado
);