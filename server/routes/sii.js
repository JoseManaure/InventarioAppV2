const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    obtenerNuevoFolio
} = require("../sii_v2/servicios/folioService");


router.get(
    "/test-folio",
    verifyToken,
    async (req, res) => {

        try {


            const dte = await obtenerNuevoFolio({

                empresa: req.user.empresa,

                tipoDTE: 33,

                usuario: req.user.id

            });


            res.json({

                ok: true,

                dte

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({

                error: error.message

            });

        }

    });


module.exports = router;