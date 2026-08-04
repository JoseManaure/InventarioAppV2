const express = require("express");
console.log("✅ ROUTE CERTIFICADOS CARGADA");
const multer = require("multer");
const path = require("path");

const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const leerCertificado = require("../sii_v2/certificados/leerCertificado");

const Empresa = require("../models/Empresa");

const router = express.Router();

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(
            null,
            path.join(__dirname, "../uploads/certificados")
        );

    },

    filename(req, file, cb) {

        cb(
            null,
            `${req.user.empresa}.pfx`
        );

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    },

    fileFilter(req, file, cb) {

        const extension = path.extname(file.originalname);

        if (extension.toLowerCase() !== ".pfx") {

            return cb(
                new Error("Solo se permiten certificados .pfx")
            );

        }

        cb(null, true);

    }

});


router.post(
    "/",
    verifyToken,
    requireRole("admin"),
    upload.single("certificado"),
    async (req, res) => {

        try {
            console.log("========== SUBIENDO CERTIFICADO ==========");
            console.log(req.file);
            console.log(req.body);
            if (!req.file) {

                return res.status(400).json({
                    error: "No se recibió certificado"
                });

            }

            const empresa = await Empresa.findById(req.user.empresa);

            if (!empresa) {

                return res.status(404).json({
                    error: "Empresa no encontrada"
                });

            }

            const info = leerCertificado(
                req.file.path,
                req.body.password
            );

            if (!info.valido) {

                return res.status(400).json({
                    error: info.error
                });

            }

            empresa.certificadoDigital = {

                archivo: req.file.filename,

                password: req.body.password,

                fechaCarga: new Date(),

                valido: true,

                serial: info.serial,

                fingerprint: info.fingerprint,

                vence: info.validTo,

                subject: info.subject,

                issuer: info.issuer

            };

            await empresa.save();

            res.json({

                ok: true,

                certificado: empresa.certificadoDigital

            });

        }

        catch (error) {

            console.error(error);

            res.status(500).json({

                error: error.message

            });

        }

    }
);

router.get(
    "/",
    verifyToken,
    async (req, res) => {
        try {

            console.log("Usuario:", req.user);

            const empresa = await Empresa.findById(req.user.empresa);

            console.log("Empresa encontrada:");
            console.log(empresa);

            if (!empresa) {
                return res.status(404).json({
                    error: "Empresa no encontrada"
                });
            }

            console.log("Certificado:");
            console.log(empresa.certificadoDigital);

            return res.json(empresa.certificadoDigital || {});

        } catch (error) {

            console.error("ERROR GET CERTIFICADO");
            console.error(error);

            return res.status(500).json({
                error: error.message
            });
        }
    }
);
module.exports = router;