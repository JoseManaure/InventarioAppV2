// src/services/itemMatcher.js

const { normalizarTexto } = require("../utils/normalizarTexto");

// 🔎 Match exacto
const encontrarExacto = (input, items) => {
    const limpio = normalizarTexto(input);

    return items.find(item =>
        normalizarTexto(item.nombre) === limpio
    );
};

// 🧠 Match flexible
const encontrarSimilar = (input, items) => {
    const limpio = normalizarTexto(input);

    return items.find(item => {
        const nombreItem = normalizarTexto(item.nombre);

        return (
            nombreItem.includes(limpio) ||
            limpio.includes(nombreItem)
        );
    });
};

// 🚀 Motor principal
const encontrarItem = (nombre, items) => {
    let item = encontrarExacto(nombre, items);
    if (item) return item;

    item = encontrarSimilar(nombre, items);
    if (item) return item;

    return null;
};

module.exports = { encontrarItem };