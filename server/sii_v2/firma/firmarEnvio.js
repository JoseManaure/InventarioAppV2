const fs = require("fs");
const path = require("path");
const { SignedXml } = require("xml-crypto");
const { cargarCertificado } = require("./firmaDigital");


function firmarEnvio(rutaXML) {

    const xml = fs.readFileSync(rutaXML, "latin1");

    const {
        privateKey,
        certificate
    } = cargarCertificado();


    const sig = new SignedXml();


    sig.idAttributes = [
        "ID"
    ];


    sig.privateKey = privateKey;


    sig.signatureAlgorithm =
        "http://www.w3.org/2000/09/xmldsig#rsa-sha1";


    sig.canonicalizationAlgorithm =
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";


    console.log("AGREGANDO REFERENCIA SETDTE");

    sig.addReference({

        xpath: "//*[local-name()='SetDTE' and @ID='SetDoc']",

        transforms: [
            "http://www.w3.org/2000/09/xmldsig#enveloped-signature"
        ],

        digestAlgorithm:
            "http://www.w3.org/2000/09/xmldsig#sha1"

    });



    sig.keyInfoProvider = {

        getKeyInfo() {

            const cert =
                certificate
                    .replace(/-----BEGIN CERTIFICATE-----/g, "")
                    .replace(/-----END CERTIFICATE-----/g, "")
                    .replace(/\r?\n|\r/g, "");


            return `
<X509Data>
<X509Certificate>${cert}</X509Certificate>
</X509Data>`;

        }

    };

    sig.computeSignature(xml, {

        location: {

            reference:
                "//*[local-name()='SetDTE']",

            action: "append"

        }

    });



    const firmado =
        sig.getSignedXml();



    const rutaFirmada =
        rutaXML.replace(
            "ENVIO_",
            "ENVIO_FIRMADO_"
        );


    fs.writeFileSync(
        rutaFirmada,
        firmado,
        "utf8"
    );


    console.log(
        "ENVIO FIRMADO:",
        rutaFirmada
    );


    return {
        xml: firmado,
        ruta: rutaFirmada
    };

}


module.exports = {
    firmarEnvio
};