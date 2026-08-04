const Empresa = require("../../models/Empresa");


async function obtenerFolioEmpresa({
    empresaId,
    tipoDocumento
}) {


    const empresa = await Empresa.findById(
        empresaId
    );


    if (!empresa) {

        throw new Error(
            "Empresa no encontrada"
        );

    }


    if (!empresa.caf) {

        throw new Error(
            "Empresa sin CAF configurado"
        );

    }


    const caf = empresa.caf[tipoDocumento];


    if (!caf) {

        throw new Error(
            `No existe CAF para ${tipoDocumento}`
        );

    }



    if (caf.actual >= caf.hasta) {

        throw new Error(
            "CAF agotado"
        );

    }



    caf.actual++;


    await empresa.save();



    return caf.actual;

}



module.exports = {

    obtenerFolioEmpresa

};