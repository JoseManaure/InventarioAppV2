const fs = require("fs");


const ruta =
    "./xml_generados/ENVIO_FIRMADO_6a42dcd1d1b206ea01771e72_29.xml";


const xml =
    fs.readFileSync(
        ruta,
        "utf8"
    );


const firmas =
    [
        ...xml.matchAll(
            /<Signature[\s\S]*?<\/Signature>/g
        )
    ];


firmas.forEach((f, index) => {

    console.log("\n====================");
    console.log("FIRMA", index + 1);

    const signature = f[0];

    console.log(
        signature
            .substring(0, 1000)
    );


});