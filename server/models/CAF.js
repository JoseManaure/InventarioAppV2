const mongoose = require("mongoose");

const cafSchema = new mongoose.Schema({

    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
        required: true,
        index: true
    },

    tipoDTE: {
        type: Number,
        enum: [33, 39, 52],
        required: true
    },

    desde: Number,

    hasta: Number,

    folioActual: {
        type: Number,
        default: 0
    },

    rutaXML: String,

    activo: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "CAF",
    cafSchema
);