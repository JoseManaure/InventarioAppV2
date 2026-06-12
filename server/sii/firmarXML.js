const { SignedXml } = require('xml-crypto');
const { DOMParser } = require('xmldom');

const { cargarCertificado } = require('./firmaDigital');

function firmarXML(xml) {

    const { privateKey, certificate } = cargarCertificado();

    const sig = new SignedXml();

    sig.signatureAlgorithm =
        'http://www.w3.org/2000/09/xmldsig#rsa-sha1';

    sig.addReference(
        "//*[local-name(.)='DTE']",
        ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'],
        'http://www.w3.org/2000/09/xmldsig#sha1'
    );

    sig.signingKey = privateKey;

    sig.keyInfoProvider = {
        getKeyInfo() {

            return `
<X509Data>
  <X509Certificate>
    ${certificate
                    .replace('-----BEGIN CERTIFICATE-----', '')
                    .replace('-----END CERTIFICATE-----', '')
                    .replace(/\r?\n|\r/g, '')}
  </X509Certificate>
</X509Data>
`;
        }
    };

    const doc = new DOMParser().parseFromString(xml);

    sig.computeSignature(xml);

    return sig.getSignedXml();
}

module.exports = {
    firmarXML
};