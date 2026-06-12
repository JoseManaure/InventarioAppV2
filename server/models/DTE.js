const mongoose = require('mongoose');

const DTEItemSchema = new mongoose.Schema({
    codigo: String,
    nombre: String,
    cantidad: Number,
    precio: Number,
    subtotal: Number
});

const DTESchema = new mongoose.Schema({
    tipo: {
        type: Number,
        required: true
        // 39 boleta
        // 33 factura
        // 52 guia
    },

    folio: {
        type: Number
    },

    estado: {
        type: String,
        enum: [
            'pendiente',
            'emitido',
            'rechazado'
        ],
        default: 'pendiente'
    },

    cliente: {
        type: String,
        required: true
    },

    rutCliente: String,

    direccion: String,

    productos: [DTEItemSchema],

    total: Number,

    folioVisible: String,

    xml: String,

    pdfUrl: String,

    respuestaSII: Object,

    trackId: String

}, {
    timestamps: true
});

module.exports = mongoose.model('DTE', DTESchema);