const { generarTED, cargarCAF } = require("./xml/generarTED");
const crypto = require("crypto");

const dtePrueba = {
    encabezado: {
        tipoDTE: 39,
        folio: 1,
        fecha: new Date(),
        emisor: {
            rut: "76123456-7"
        },
        receptor: {
            rut: "11111111-1",
            nombre: "Cliente Prueba"
        }
    },
    totales: {
        neto: 20000,
        iva: 3800,
        total: 23800
    },
    detalle: [
        { linea: 1, nombre: "Arena", cantidad: 2, precio: 10000, total: 20000 }
    ]
};

const rutaCAF = "certificados/test/CAF_39_prueba.xml";

console.log("========================================");
console.log("1. Generando TED con el CAF de prueba");
console.log("========================================");

const ted = generarTED(dtePrueba, rutaCAF);
console.log(ted);

console.log("========================================");
console.log("2. Verificando la firma manualmente");
console.log("========================================");

const matchDD = ted.match(/<DD>[\s\S]*?<\/DD>/);
const matchFrmt = ted.match(/<FRMT[^>]*>([\s\S]*?)<\/FRMT>/);

const ddString = matchDD[0];
const firmaBase64 = matchFrmt[1].trim();

const { privateKey } = cargarCAF(rutaCAF);
const publicKey = crypto.createPublicKey(privateKey);

const verifier = crypto.createVerify("RSA-SHA1");
verifier.update(ddString, "utf8");
verifier.end();

const esValida = verifier.verify(publicKey, firmaBase64, "base64");

console.log("¿Firma válida?:", esValida ? "✅ SÍ" : "❌ NO");
