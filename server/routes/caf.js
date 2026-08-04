const express = require("express");
const router = express.Router();

const verifyToken =
    require("../middleware/verifyToken");


const {
    cargarCAFEmpresa
} = require("../sii_v2/servicios/cafService");


router.post(
    "/cargar",
    verifyToken,
    async (req, res) => {

        try {


            const caf =
                await cargarCAFEmpresa({

                    empresaId: req.user.empresa,

                    rutaCAF: req.body.rutaCAF,

                    tipoDocumento: req.body.tipoDocumento

                });


            res.json({

                ok: true,

                caf

            });


        } catch (error) {

            console.log(error);


            res.status(500).json({

                error: error.message

            });


        }

    });


module.exports = router;