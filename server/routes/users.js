const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const User = require('../models/User');

const verifyToken =
    require('../middleware/verifyToken');

const requireRole =
    require('../middleware/requireRole');


// =====================================
// LISTAR USUARIOS
// =====================================
router.get(
    '/',
    verifyToken,
    requireRole('admin'),
    async (req, res) => {

        try {

            const usuarios =
                await User.find()
                    .select('-password')
                    .sort({
                        createdAt: -1
                    });

            res.json(usuarios);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error obteniendo usuarios'
            });
        }
    }
);


// =====================================
// CREAR USUARIO
// =====================================
router.post(
    '/',
    verifyToken,
    requireRole('admin'),
    async (req, res) => {

        try {

            const {
                name,
                email,
                password,
                role
            } = req.body;

            const existe =
                await User.findOne({
                    email
                });

            if (existe) {
                return res.status(400).json({
                    error: 'El usuario ya existe'
                });
            }

            const hash =
                await bcrypt.hash(
                    password,
                    10
                );

            const usuario =
                await User.create({
                    name,
                    email,
                    password: hash,
                    role
                });

            res.status(201).json({
                message:
                    'Usuario creado correctamente',
                usuario
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error creando usuario'
            });
        }
    }
);


// =====================================
// ELIMINAR USUARIO
// =====================================
router.delete(
    '/:id',
    verifyToken,
    requireRole('admin'),
    async (req, res) => {

        try {

            await User.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    'Usuario eliminado'
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    'Error eliminando usuario'
            });
        }
    }
);

module.exports = router;