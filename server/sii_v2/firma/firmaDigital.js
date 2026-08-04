require("dotenv").config({
    path: "../.env"
});


const fs = require("fs");
const path = require("path");
const forge = require("node-forge");

function cargarCertificado() {

    const certPath = path.join(
        __dirname,
        "..",
        process.env.SII_CERT_PATH
    );

    const password = process.env.SII_CERT_PASS;

    if (!process.env.SII_CERT_PATH) {
        throw new Error(
            "Falta la variable de entorno SII_CERT_PATH (ruta al archivo .p12)."
        );
    }

    if (!password) {
        throw new Error(
            "Falta la variable de entorno SII_CERT_PASS (contraseña del .p12)."
        );
    }

    if (!fs.existsSync(certPath)) {
        throw new Error(
            `No se encontró el archivo de certificado en: ${certPath}`
        );
    }

    const pfxBuffer = fs.readFileSync(certPath);

    let p12;

    try {

        const p12Asn1 = forge.asn1.fromDer(
            forge.util.createBuffer(
                pfxBuffer.toString("binary")
            )
        );

        p12 = forge.pkcs12.pkcs12FromAsn1(
            p12Asn1,
            password
        );

    } catch (err) {

        throw new Error(
            `No se pudo leer el archivo .p12. Verifica que la contraseña (SII_CERT_PASS) sea correcta y que el archivo no esté dañado. Detalle: ${err.message}`
        );

    }

    let privateKey = null;
    let certificate = null;

    for (const safeContent of p12.safeContents) {

        for (const safeBag of safeContent.safeBags) {

            // -----------------------
            // Llave privada
            // -----------------------

            if (safeBag.key) {

                privateKey =
                    forge.pki.privateKeyToPem(
                        safeBag.key
                    );

            }

            // -----------------------
            // Certificado X509
            // -----------------------

            if (safeBag.cert) {

                certificate =
                    forge.pki.certificateToPem(
                        safeBag.cert
                    );

            }

        }

    }

    if (!privateKey) {
        throw new Error(
            "El archivo .p12 no contiene una llave privada válida."
        );
    }

    if (!certificate) {
        throw new Error(
            "El archivo .p12 no contiene un certificado válido."
        );
    }

    return {

        privateKey,

        certificate

    };

}

module.exports = {

    cargarCertificado

};