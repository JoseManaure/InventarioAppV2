const Empresa = require("../../models/Empresa");
const DTE = require("../../models/DTE");
const {
    firmarEnvio
} = require("../firma/firmarEnvio");
const {
    generarTED
} = require("../xml/generarTED");

const {
    insertarTED
} = require("../xml/insertarTED");

const {
    guardarXML
} = require("./xmlService");

const {
    generarEnvioDTE
} = require("./envioService");

const {
    obtenerNuevoFolio
} = require("./folioService");

const {
    generarDTEBoleta
} = require("../builders/DTEBuilder");

const {
    generarXMLDTE
} = require("../builders/XMLBuilder");

const {
    firmarXML
} = require("../firma/firmarXML");


async function emitirDTE({

    empresa,
    usuario,
    tipoDTE,
    cliente,
    rut,
    productos,
    total

}) {

    // ============================
    // EMPRESA
    // ============================

    const empresaDB = await Empresa.findById(empresa);

    if (!empresaDB) {

        throw new Error("Empresa no encontrada.");

    }

    // ============================
    // FOLIO
    // ============================

    const registroFolio = await obtenerNuevoFolio({

        empresa,
        tipoDTE,
        usuario

    });

    // ============================
    // DTE
    // ============================

    const dte = await generarDTEBoleta({

        empresa,

        empresaDB,

        folio: registroFolio.folio,

        cliente,

        rut,

        productos,

        total

    });

    // ============================
    // XML
    // ============================

    let xml = generarXMLDTE(dte);

    console.log("================================");
    console.log("XML GENERADO");
    console.log("================================");
    console.log(xml);
    console.log("================================");

    // ============================
    // TED
    // ============================

    const ted = generarTED(dte, "certificados/test/CAF_39_prueba.xml");

    xml = insertarTED(xml, ted);

    guardarXML({

        xml,

        empresa,

        tipoDTE,

        folio: registroFolio.folio

    });

    console.log({
        folio: registroFolio.folio,
        tipoDTE
    });
    // ============================
    // FIRMA
    // ============================

    console.log("🔐 Firmando XML...");


    const idDocumento =
        `F${registroFolio.folio}T${tipoDTE}`;


    console.log(
        "ID DOCUMENTO FIRMA:",
        idDocumento
    );


    const xmlFirmado =
        firmarXML(
            xml,
            idDocumento
        );


    console.log("✅ XML firmado");

    // ============================
    // GUARDAR EN MONGO
    // ============================

    const guardado = await DTE.findByIdAndUpdate(

        registroFolio._id,

        {

            tipoDocumento: "boleta",

            folio: registroFolio.folio,

            cliente: {

                nombre: cliente,

                rut

            },

            productos,

            total,

            xml: xmlFirmado,

            estado: "firmado"

        },

        {

            new: true

        }

    );

    // ============================
    // GENERAR ENVIO DTE
    // ============================

    const rutaEnvio = generarEnvioDTE({

        empresa,

        empresaDB,

        xmlFirmado,

        tipoDTE,

        folio: registroFolio.folio

    });

    console.log("================================");
    console.log("ENVIO DTE GENERADO");
    console.log(rutaEnvio);
    console.log("================================");

    // ============================
    // FIRMAR ENVIO DTE
    // ============================

    const resultadoEnvioFirmado = firmarEnvio(rutaEnvio);

    console.log("================================");
    console.log("ENVIO DTE FIRMADO");
    console.log(resultadoEnvioFirmado);
    console.log("================================");

    return {

        dte,

        registro: guardado

    };

}

module.exports = {

    emitirDTE

};