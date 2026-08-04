const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    emitirDTE
} = require("../sii_v2/servicios/dteService");

router.post(
    "/emitir",
    verifyToken,
    async (req, res) => {

        try {

            const dte = await emitirDTE({

                empresa: req.user.empresa,

                usuario: req.user.id,

                tipoDTE: req.body.tipoDTE,

                cliente: req.body.cliente,

                rut: req.body.rut,

                productos: req.body.productos,

                total: req.body.total

            });

            res.json({

                ok: true,

                dte

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                ok: false,

                error: error.message

            });

        }

    }
);

router.post(
    "/enviar/:id",
    verifyToken,
    async (req, res) => {

        try {

            const resultado =
                await enviarAlSII(req.params.id);


            res.json({
                ok: true,
                resultado
            });


        } catch (error) {

            res.status(500).json({
                ok: false,
                error: error.message
            });

        }

    });

module.exports = router;