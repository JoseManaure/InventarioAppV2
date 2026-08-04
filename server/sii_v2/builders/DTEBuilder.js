const Empresa = require("../../models/Empresa");

async function generarDTEBoleta(datos) {

    const empresa = await Empresa.findById(datos.empresa);
    console.log("==============================");
    console.log("EMPRESA DESDE MONGO");
    console.log(empresa);
    console.log("==============================");

    if (!empresa) {
        throw new Error("Empresa no encontrada");
    }

    return {
        encabezado: {
            tipoDTE: 39,
            folio: datos.folio,
            fecha: new Date(),

            emisor: {

                rut: empresa.rut,

                razonSocial:
                    empresa.razonSocial || empresa.nombre,

                giro: empresa.giro,

                direccion: empresa.direccion,

                comuna: empresa.comuna,

                ciudad: empresa.ciudad
            },

            receptor: {

                nombre: datos.cliente || "Cliente General",

                rut: datos.rut || "66666666-6"
            }
        },

        detalle: datos.productos.map((p, i) => ({

            linea: i + 1,

            nombre: p.nombre,

            cantidad: p.cantidad,

            precio: p.precio,

            total: p.cantidad * p.precio

        })),

        totales: {

            neto: datos.total,

            iva: Math.round(datos.total * 0.19),

            total: Math.round(datos.total * 1.19)

        }
    };

}

module.exports = {
    generarDTEBoleta
};