const normalizarTexto = (str) => {
    if (!str) return "";

    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // elimina acentos
        .replace(/[^a-z0-9\s]/g, "") // elimina símbolos raros
        .replace(/\s+/g, " ") // espacios múltiples → uno
        .trim();
};

module.exports = { normalizarTexto };