const fs = require("fs");
const { SignedXml } = require("xml-crypto");

const {
    cargarCertificado
} = require("./firmaDigital");


const ruta =
    "./xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_29.xml";


const xml =
    fs.readFileSync(
        ruta,
        "utf8"
    );


const {
    certificate
} = cargarCertificado();


const firmas =
    [
        ...xml.matchAll(
            /<Signature[\s\S]*?<\/Signature>/g
        )
    ];


console.log(
    "Cantidad firmas:",
    firmas.length
);



firmas.forEach(
    (firma, index) => {


        console.log(
            "\n======================"
        );

        console.log(
            "VALIDANDO FIRMA",
            index + 1
        );


        const sig =
            new SignedXml();


        sig.idAttributes = [
            "ID"
        ];

        sig.getCertFromKeyInfo =
            function () {

                return certificate;

            };
        sig.keyInfoProvider = {

            getKeyInfo() {
                return `
                    <X509Data>
                    <X509Certificate>
                    ${certificate
                        .replace(/-----BEGIN CERTIFICATE-----/g, "")
                        .replace(/-----END CERTIFICATE-----/g, "")
                        .replace(/\n/g, "")}
                    </X509Certificate>
                    </X509Data>
                    `;
            }

        };


        sig.loadSignature(
            firma[0]
        );


        const valido =
            console.log(
                "SignedInfo:",
                sig.signature?.signedInfo
            );
        sig.checkSignature(
            xml
        );


        console.log(
            "VALIDA:",
            valido
        );


        console.log(
            "ERRORES:"
        );


        console.log(
            sig.validationErrors
        );


    }
);