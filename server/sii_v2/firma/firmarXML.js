const fs = require("fs")
const { SignedXml } = require("xml-crypto");
const { cargarCertificado } = require("./firmaDigital");

function firmarXML(xml, idDocumento) {
    const { privateKey, certificate } = cargarCertificado();

    if (!privateKey || !certificate) {
        throw new Error("Certificado digital no encontrado");
    }

    const sig = new SignedXml();

    sig.idAttributes = ["ID"];
    sig.privateKey = privateKey;
    sig.publicCert = certificate;

    sig.signatureAlgorithm =
        "http://www.w3.org/2000/09/xmldsig#rsa-sha1";

    sig.canonicalizationAlgorithm =
        "http://www.w3.org/2001/10/xml-exc-c14n#";

    sig.addReference({
        xpath: `//*[@ID='${idDocumento}']`,
        transforms: [
            "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
            "http://www.w3.org/2001/10/xml-exc-c14n#"
        ],
        digestAlgorithm:
            "http://www.w3.org/2000/09/xmldsig#sha1"
    });

    sig.getKeyInfoContent = function () {
        const cleanCert = certificate
            .replace("-----BEGIN CERTIFICATE-----", "")
            .replace("-----END CERTIFICATE-----", "")
            .replace(/\r?\n|\r/g, "");

        return `<X509Data>
<X509Certificate>${cleanCert}</X509Certificate>
</X509Data>`;
    };

    sig.computeSignature(xml);

    const firmado = sig.getSignedXml();

    fs.writeFileSync(
        "DESPUES_DE_FIRMAR_DTE.xml",
        firmado,
        "utf8"
    );

    return firmado;
    return sig.getSignedXml();
}

module.exports = { firmarXML };