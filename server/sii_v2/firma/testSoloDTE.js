const fs = require("fs");
const { SignedXml } = require("xml-crypto");
const { cargarCertificado } = require("./firmaDigital");


const xml =
    fs.readFileSync(
        "./xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_31.xml",
        "utf8"
    );


const {
    certificate
} = cargarCertificado();



const firmaDTE =
    xml.match(
        /<Signature[\s\S]*?<\/Signature>/
    )[0];



const documentoMatch =
    xml.match(
        /<Documento\s+ID="[^"]+"[\s\S]*?<\/Documento>/
    );


if (!documentoMatch) {

    throw new Error(
        "No se encontró Documento"
    );

}


const documento =
    documentoMatch[0];



console.log(
    "DOCUMENTO EXTRAIDO:"
);

console.log(
    documento.substring(0, 200)
);



const sig =
    new SignedXml();


sig.idAttributes = [
    "ID"
];


sig.publicCert =
    certificate;


sig.loadSignature(
    firmaDTE
);



const resultado =
    sig.checkSignature(
        documento
    );



console.log(
    "VALIDA DTE:",
    resultado
);


console.log(
    sig.validationErrors
);