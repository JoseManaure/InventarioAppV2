const fs = require("fs");
const { SignedXml } = require("xml-crypto");


const xml = fs.readFileSync(
    "xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_39.xml",
    "utf8"
);


const sig = new SignedXml();


sig.publicCert =
    fs.readFileSync(
        "certificados/certificado.pem",
        "utf8"
    );


try {

    sig.loadSignature(xml);

    const ok = sig.checkSignature(xml);


    console.log(
        "VALIDACION XML-CRYPTO:"
    );

    console.log(ok);


    if (!ok) {

        console.log(
            sig.validationErrors
        );

    }


} catch (e) {

    console.error(e);

}