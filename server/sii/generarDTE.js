// server/sii/generarDTE.js

const { obtenerNuevoCorrelativoSeguro } = require('../utils/correlativo');

async function generarDTEBoleta(datos) {

    const folio = await obtenerNuevoCorrelativoSeguro('boleta');

    return {
        encabezado: {
            tipoDTE: 39, // boleta electrónica
            folio,
            fecha: new Date(),

            emisor: {
                rut: "76XXXXXXXX",
                razonSocial: "MMD SPA",
                giro: "VENTA DE ÁRIDOS",
                direccion: "Balmaceda 01091",
                comuna: "Peñaflor"
            },

            receptor: {
                nombre: datos.cliente || "Cliente General",
                rut: datos.rut || "66666666-6"
            }
        },

        detalle: datos.productos.map((p, index) => ({
            linea: index + 1,
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