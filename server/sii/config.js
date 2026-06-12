const path = require('path');

module.exports = {

    empresa: {
        rut: 'TU_RUT_EMPRESA',
        razonSocial: 'MMD SPA',
        giro: 'VENTA DE ÁRIDOS',
        direccion: 'Peñaflor',
        comuna: 'Peñaflor',
        actividadEconomica: 'Venta materiales'
    },

    certificado: {
        path: path.join(
            __dirname,
            'certificados',
            'certificado.pfx'
        ),

        password: process.env.CERT_PASSWORD
    }

};