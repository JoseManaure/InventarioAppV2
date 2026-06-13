// server/routes/facturas.js
const express = require('express');
const Factura = require('../models/Factura');
const Item = require("../models/Item");
const router = express.Router();

const { generarDTEBoleta } = require('../sii/generarDTE');
const { generarXMLBoleta } = require('../sii/generarXML');
const { cargarCertificado } = require('../sii/firmaDigital');
const { firmarXML } = require('../sii/firmarXML');

router.get('/test-xml', async (req, res) => {

  const dte = await generarDTEBoleta({
    cliente: 'Jose Manaure',

    productos: [
      {
        nombre: 'Arena Gruesa',
        cantidad: 2,
        precio: 29500
      }
    ],

    total: 59000
  });

  const xml = generarXMLBoleta(dte);

  res.type('application/xml');

  res.send(xml);
});

router.get('/test-dte', async (req, res) => {

  const dte = await generarDTEBoleta({
    cliente: 'Jose Manaure',

    productos: [
      {
        nombre: 'Arena Gruesa',
        cantidad: 2,
        precio: 29500
      }
    ],

    total: 59000
  });

  res.json(dte);
});

// Crear factura y actualizar items correctamente
router.post("/", async (req, res) => {
  try {
    const nueva = new Factura(req.body);
    const guardada = await nueva.save();

    for (const producto of guardada.productos) {
      let item;
      if (producto.codigo) {
        item = await Item.findOne({ codigo: producto.codigo });
      }
      if (!item) {
        item = await Item.findOne({ nombre: producto.nombre });
      }

      if (item) {
        item.cantidad = (item.cantidad || 0) + producto.cantidad;

        // 👇 precio venta
        item.precio = producto.costo;

        // 👇 costo real compra
        item.costo = producto.precioUnitario;

        item.fecha = new Date();

        if (producto.codigo) {
          item.codigo = producto.codigo;
        }

        await item.save();
      } else {
        const nuevoItem = new Item({
          nombre: producto.nombre,

          cantidad: producto.cantidad,

          // 👇 precio venta
          precio: producto.costo,

          // 👇 costo real compra
          costo: producto.precioUnitario,

          fecha: new Date(),

          codigo: producto.codigo,
        });
        await nuevoItem.save();
      }

    }

    res.status(201).json(guardada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo crear la factura" });
  }
});


// Obtener facturas con filtro por mes
router.get('/', async (req, res) => {
  try {
    const { mes, pagina = 1, limite = 10 } = req.query;

    const query = {};
    if (mes) {
      // mes = '2025-08'
      const inicio = new Date(`${mes}-01T00:00:00.000Z`);
      const fin = new Date(inicio);
      fin.setMonth(fin.getMonth() + 1);
      query.fechaCreacion = { $gte: inicio, $lt: fin };
    }

    const skip = (Number(pagina) - 1) * Number(limite);
    const total = await Factura.countDocuments(query);
    const facturas = await Factura.find(query).sort({ fechaCreacion: -1 }).skip(skip).limit(Number(limite));

    res.json({ facturas, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo obtener facturas' });
  }
});

router.get('/test-certificado', async (req, res) => {

  try {

    const cert = cargarCertificado();

    res.json({
      ok: true,
      certificadoCargado: !!cert.certificate,
      privateKey: !!cert.privateKey
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

router.get('/test-firma', async (req, res) => {

  try {

    const dte = await generarDTEBoleta({
      cliente: 'Jose Manaure',

      productos: [
        {
          nombre: 'Arena Gruesa',
          cantidad: 2,
          precio: 29500
        }
      ],

      total: 59000
    });

    const xml = generarXMLBoleta(dte);

    const firmado = firmarXML(xml);

    res.type('application/xml');

    res.send(firmado);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});


module.exports = router;
