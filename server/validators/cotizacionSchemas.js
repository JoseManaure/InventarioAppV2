const { z } = require("zod");

// =========================
// ADMINISTRACIÓN
// =========================

const cotizacionAdminSchema = z.object({
    cliente: z.string().min(2).max(100),

    emailCliente: z
        .string()
        .max(100)
        .optional(),

    telefonoCliente: z.string().min(6).max(20),

    direccion: z.string().min(5).max(200),

    metodoPago: z.enum([
        "efectivo",
        "transferencia"
    ]),

    fechaEntrega: z.string(),

    productos: z.array(
        z.object({
            nombre: z.string().min(2),
            cantidad: z.number().positive(),
            precio: z.number().positive()
        })
    ).min(1)
});

// =========================
// WEB PÚBLICA
// =========================

const cotizacionPublicaSchema = z.object({
    cliente: z.string().min(2).max(100),

    emailCliente: z
        .string()
        .max(100)
        .optional(),

    telefonoCliente: z
        .string()
        .optional(),

    direccion: z
        .string()
        .optional(),

    metodoPago: z.enum([
        "efectivo",
        "transferencia"
    ]),

    fechaEntrega: z.string(),

    productos: z.array(
        z.object({
            codigo: z.string().optional(),
            nombre: z.string().min(2),
            cantidad: z.number().positive(),
            precio: z.number().positive()
        })
    ).min(1)
});

module.exports = {
    cotizacionAdminSchema,
    cotizacionPublicaSchema
};