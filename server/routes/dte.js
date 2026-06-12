const express = require('express');
const router = express.Router();

const DTE = require('../models/DTE');
const {
    obtenerNuevoCorrelativoSeguro
} = require('../utils/correlativo');
router.post('/emitir', async (req, res) => {

    try {

        const {
            cliente,
            direccion,
            productos,
            total
        } = req.body;

        const nuevoDTE = await DTE.create({

            tipo: 39,
            folioVisible,
            folio,

            estado: 'emitido',

            cliente,
            direccion,
            productos,
            total

        });
        const folio =
            await obtenerNuevoCorrelativoSeguro('boleta');
        const folioVisible =
            `BOL-${String(folio).padStart(6, '0')}`;
        const pdf =
            await generarPDFBoleta(nuevoDTE);

        nuevoDTE.pdfUrl = pdf.url;

        await nuevoDTE.save();
        res.json({
            ok: true,
            dte: nuevoDTE
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            error: 'Error generando DTE'
        });
    }

});

module.exports = router;