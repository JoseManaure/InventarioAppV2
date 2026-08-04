const { SignedXml } = require("xml-crypto");
const { cargarCertificado } = require("./firmaDigital");


function firmarEnvioXML(xml) {

    const {
        privateKey,
        certificate
    } = cargarCertificado();


    const sig = new SignedXml();


    sig.idAttributes = ["ID"];


    sig.privateKey = privateKey;


    sig.signatureAlgorithm =
        "http://www.w3.org/2000/09/xmldsig#rsa-sha1";


    sig.canonicalizationAlgorithm =
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";


    sig.addReference({

        xpath:
            "//*[@ID='SetDoc']",


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
                    .replace(
                        "-----BEGIN CERTIFICATE-----",
                        ""
                    )
                    .replace(
                        "-----END CERTIFICATE-----",
                        ""
                    )
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
            action: "after"
        }
    });


    return sig.getSignedXml();

}


module.exports = {
    firmarEnvioXML
};