const mongoose = require("mongoose");


const empresaSchema = new mongoose.Schema({


    nombre: {

        type: String,

        required: true,

    },


    owner: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        unique: true

    },


    // ==========================
    // DATOS BÁSICOS
    // ==========================


    rut: String,

    razonSocial: String,

    direccion: String,

    comuna: String,

    ciudad: String,

    giro: String,


    telefono: String,

    email: String,


    contacto: String,


    actividadEconomica: String,

    codigoActividad: String,


    sucursal: {

        type: String,

        default: "Casa Matriz"

    },


    // ==========================
    // RESOLUCIÓN SII
    // ==========================


    resolucionSII: {

        numero: String,

        fecha: String

    },



    // ==========================
    // CERTIFICADO DIGITAL
    // ==========================


    certificadoDigital: {


        archivo: String,


        password: String,


        fechaCarga: Date,


        valido: Boolean,


        serial: String,


        fingerprint: String,


        vence: Date,


        subject: mongoose.Schema.Types.Mixed,


        issuer: mongoose.Schema.Types.Mixed


    },



    // ==========================
    // CAF SII
    // ==========================


    caf: {


        // ----------------------
        // BOLETA ELECTRÓNICA 39
        // ----------------------

        boleta: {


            archivo: String,


            tipoDTE: {

                type: Number,

                default: 39

            },


            desde: Number,


            hasta: Number,


            actual: {


                type: Number,


                default: 1


            },


            fechaCarga: Date


        },



        // ----------------------
        // FACTURA ELECTRÓNICA 33
        // ----------------------

        factura: {


            archivo: String,


            tipoDTE: {


                type: Number,

                default: 33


            },


            desde: Number,


            hasta: Number,


            actual: {


                type: Number,


                default: 1


            },


            fechaCarga: Date


        },



        // ----------------------
        // GUÍA DESPACHO 52
        // ----------------------

        guia: {


            archivo: String,


            tipoDTE: {


                type: Number,

                default: 52


            },


            desde: Number,


            hasta: Number,


            actual: {


                type: Number,

                default: 1


            },


            fechaCarga: Date


        }


    },



    // ==========================
    // AMBIENTE SII
    // ==========================


    ambiente: {


        type: String,


        enum: [

            "certificacion",

            "produccion"

        ],


        default: "certificacion"


    }



}, {


    timestamps: true


});



module.exports = mongoose.model(
    "Empresa",
    empresaSchema
);