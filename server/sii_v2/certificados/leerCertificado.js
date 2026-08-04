const fs = require("fs");
const forge = require("node-forge");

function leerCertificado(rutaArchivo, password) {
    try {

        const pfxBuffer = fs.readFileSync(rutaArchivo);

        const p12Asn1 = forge.asn1.fromDer(
            forge.util.createBuffer(pfxBuffer.toString("binary"))
        );

        const p12 = forge.pkcs12.pkcs12FromAsn1(
            p12Asn1,
            false,
            password
        );

        const bags = p12.getBags({
            bagType: forge.pki.oids.certBag
        });

        const cert = bags[forge.pki.oids.certBag][0].cert;

        return {

            valido: true,

            subject: cert.subject.attributes,

            issuer: cert.issuer.attributes,

            serial: cert.serialNumber,

            validFrom: cert.validity.notBefore,

            validTo: cert.validity.notAfter

        };

    }

    catch (err) {

        const subject = {};

        cert.subject.attributes.forEach(attr => {
            subject[attr.shortName || attr.name] = attr.value;
        });

        const issuer = {};

        cert.issuer.attributes.forEach(attr => {
            issuer[attr.shortName || attr.name] = attr.value;
        });

        const md = forge.md.sha1.create();

        md.update(
            forge.asn1.toDer(
                forge.pki.certificateToAsn1(cert)
            ).getBytes()
        );

        const fingerprint = md.digest().toHex();

        return {

            valido: true,

            serial: cert.serialNumber,

            validFrom: cert.validity.notBefore,

            validTo: cert.validity.notAfter,

            subject,

            issuer,

            fingerprint

        };

    }

}

module.exports = leerCertificado;