const { SignedXml } = require("xml-crypto");
const { cargarCertificado } = require("../firma/firmaDigital");
const fs = require("fs");


function firmarSemilla(semilla) {

    const {
        privateKey,
        certificate
    } = cargarCertificado();


    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<getToken Id="_0">
    <item>
        <Semilla>${semilla}</Semilla>
    </item>
</getToken>`;


    const sig = new SignedXml();

    sig.idAttributes = ["Id"];

    sig.getKeyInfoContent = () => {

        const cleanCert = certificate
            .replace("-----BEGIN CERTIFICATE-----", "")
            .replace("-----END CERTIFICATE-----", "")
            .replace(/\r?\n|\r/g, "");

        return `<X509Data><X509Certificate>${cleanCert}</X509Certificate></X509Data>`;

    };


    sig.privateKey = privateKey;


    sig.signatureAlgorithm =
        "http://www.w3.org/2000/09/xmldsig#rsa-sha1";


    sig.canonicalizationAlgorithm =
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";


    sig.addReference({

        xpath: "//*[@Id='_0']",

        transforms: [
            "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
            "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
        ],

        digestAlgorithm:
            "http://www.w3.org/2000/09/xmldsig#sha1"

    });


    sig.computeSignature(xml);

    const firmado = sig.getSignedXml();

    fs.writeFileSync(
        "SEMILLA_FIRMADA.xml",
        firmado,
        "utf8"
    );

    return firmado;

}


module.exports = firmarSemilla;