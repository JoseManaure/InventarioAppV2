const config = require("./config/sii");

const HOST =
    config.ambiente === "produccion"
        ? "https://palena.sii.cl"
        : "https://maullin.sii.cl";

module.exports = {
    HOST,

    CR_SEED: `${HOST}/DTEWS/CrSeed.jws`,
    TOKEN: `${HOST}/DTEWS/GetTokenFromSeed.jws`,
    QUERY_EST_UP: `${HOST}/DTEWS/QueryEstUp.jws`,
    QUERY_EST_DTE: `${HOST}/DTEWS/QueryEstDte.jws`,
    DTE_UPLOAD: `${HOST}/cgi_dte/UPL/DTEUpload`
};