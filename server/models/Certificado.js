const mongoose = require("mongoose");

const certificadoSchema = new mongoose.Schema({

    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
        required: true,
        index: true
    },

    nombreArchivo: {
        type: String,
        required: true
    },

    ruta: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    fechaVencimiento: {
        type: Date
    },

    activo: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Certificado",
    certificadoSchema
);