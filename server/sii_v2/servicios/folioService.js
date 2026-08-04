const DTE = require("../../models/DTE");
const Empresa = require("../../models/Empresa");

const {
    obtenerNombreTipo
} = require("../utils/tiposDTE");


async function obtenerNuevoFolio({
    empresa,
    tipoDTE,
    usuario
}) {

    const tipoDocumento =
        obtenerNombreTipo(tipoDTE);


    console.log("==============================");
    console.log("GENERANDO NUEVO FOLIO");
    console.log("Empresa:", empresa);
    console.log("Tipo:", tipoDocumento);



    // 1. Buscar último DTE usado

    const ultimoDTE = await DTE.findOne({
        empresa,
        tipoDocumento
    })
        .sort({
            folio: -1
        });


    const ultimoFolioDTE =
        ultimoDTE
            ? ultimoDTE.folio
            : 0;



    console.log(
        "Último folio DTE:",
        ultimoFolioDTE
    );



    // 2. Buscar empresa

    const empresaDB =
        await Empresa.findById(empresa);



    if (!empresaDB) {

        throw new Error(
            "Empresa no encontrada"
        );

    }



    // 3. Crear estructura folios si no existe


    if (!empresaDB.folios) {

        empresaDB.folios = {};

    }


    if (!empresaDB.folios.boleta) {

        empresaDB.folios.boleta = {
            desde: 1,
            hasta: 999999,
            actual: 1
        };

    }


    if (!empresaDB.folios.factura) {

        empresaDB.folios.factura = {
            desde: 1,
            hasta: 999999,
            actual: 1
        };

    }


    if (!empresaDB.folios.guia) {

        empresaDB.folios.guia = {
            desde: 1,
            hasta: 999999,
            actual: 1
        };

    }



    // 4. Obtener contador actual


    let contadorEmpresa = 0;



    if (tipoDocumento === "boleta") {

        contadorEmpresa =
            empresaDB.folios.boleta.actual || 0;

    }


    if (tipoDocumento === "factura") {

        contadorEmpresa =
            empresaDB.folios.factura.actual || 0;

    }


    if (tipoDocumento === "guia") {

        contadorEmpresa =
            empresaDB.folios.guia.actual || 0;

    }



    console.log(
        "Contador empresa:",
        contadorEmpresa
    );



    // 5. Calcular próximo folio


    const folio =
        Math.max(
            ultimoFolioDTE,
            contadorEmpresa
        ) + 1;



    console.log(
        "NUEVO FOLIO:",
        folio
    );



    // 6. Actualizar contador


    if (tipoDocumento === "boleta") {

        empresaDB.folios.boleta.actual =
            folio;

    }


    if (tipoDocumento === "factura") {

        empresaDB.folios.factura.actual =
            folio;

    }


    if (tipoDocumento === "guia") {

        empresaDB.folios.guia.actual =
            folio;

    }



    await empresaDB.save();



    // 7. Seguridad contra duplicados


    const existe =
        await DTE.findOne({

            empresa,

            tipoDocumento,

            folio

        });



    if (existe) {

        throw new Error(
            `El folio ${folio} ya existe`
        );

    }



    // 8. Reservar folio


    const dte =
        await DTE.create({

            empresa,

            tipoDocumento,

            folio,

            estado: "reservado"

        });



    console.log(
        "FOLIO RESERVADO:",
        dte.folio
    );


    console.log("==============================");



    return dte;

}



module.exports = {

    obtenerNuevoFolio

};