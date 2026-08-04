const mongoose = require("mongoose");


const dteSchema = new mongoose.Schema({

    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
        required: true
    },

    tipoDocumento: {
        type: String,
        enum: [
            "boleta",
            "factura",
            "guia"
        ],
        required: true
    },


    folio: {
        type: Number,
        default: null
    },


    estado: {
        type: String,
        enum: [
            "reservado",
            "generado",
            "enviado",
            "aceptado",
            "rechazado",
            "anulado"
        ],
        default: "reservado"
    },
    respuestaSII: {
        trackId: String,
        estado: String,
        fechaEnvio: Date,
        mensaje: String
    },

    cliente: {
        nombre: String,
        rut: String,
        direccion: String
    },


    productos: [
        {
            nombre: String,
            cantidad: Number,
            precio: Number
        }
    ],


    total: {
        type: Number,
        default: 0
    },


    xml: {
        type: String,
        default: null
    },


    respuestaSII: {
        type: Object,
        default: null
    }


}, {
    timestamps: true
});


module.exports = mongoose.model(
    "DTE",
    dteSchema
);