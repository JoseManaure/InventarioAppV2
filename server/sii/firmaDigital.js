const fs = require('fs');
const path = require('path');

const forge = require('node-forge');

function cargarCertificado() {

    const certPath = path.join(
        __dirname,
        '..',
        process.env.SII_CERT_PATH
    );

    const password = process.env.SII_CERT_PASS;

    const pfxBuffer = fs.readFileSync(certPath);

    const p12Asn1 = forge.asn1.fromDer(
        forge.util.createBuffer(pfxBuffer.toString('binary'))
    );

    const p12 = forge.pkcs12.pkcs12FromAsn1(
        p12Asn1,
        password
    );

    let privateKey = null;
    let certificate = null;

    for (const sci of p12.safeContents) {

        for (const sbi of sci.safeBags) {

            if (sbi.key) {
                privateKey = forge.pki.privateKeyToPem(sbi.key);
            }

            if (sbi.cert) {
                certificate = forge.pki.certificateToPem(sbi.cert);
            }
        }
    }

    return {
        privateKey,
        certificate
    };
}

module.exports = {
    cargarCertificado
};