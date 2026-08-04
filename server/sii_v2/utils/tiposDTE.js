const TIPOS_DTE = {

    FACTURA: 33,

    FACTURA_EXENTA: 34,

    BOLETA: 39,

    BOLETA_EXENTA: 41,

    GUIA: 52,

    NOTA_DEBITO: 56,

    NOTA_CREDITO: 61

};

const MAPA = {

    33: "factura",

    34: "factura_exenta",

    39: "boleta",

    41: "boleta_exenta",

    52: "guia",

    56: "nota_debito",

    61: "nota_credito"

};

function obtenerNombreTipo(tipo) {

    return MAPA[tipo];

}

module.exports = {

    TIPOS_DTE,

    obtenerNombreTipo

};