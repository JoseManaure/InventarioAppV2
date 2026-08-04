const { execSync } = require("child_process");

try {

    const salida = execSync(`
xmlsec1 --verify \
--print-debug \
--enabled-key-data x509 \
--id-attr:ID Documento \
--id-attr:ID SetDTE \
--pubkey-cert-pem certificados/certificado.pem \
xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_37.xml
`, {
        cwd: __dirname + "/..",
        encoding: "utf8"
    });

    console.log(salida);

} catch (e) {

    console.log("============== STDOUT ==============");
    console.log(e.stdout);

    console.log("============== STDERR ==============");
    console.log(e.stderr);

}