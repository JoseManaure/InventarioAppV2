const obtenerSemilla = require("../auth/obtenerSemilla");
const firmarSemilla = require("../auth/firmarSemilla");
const obtenerToken = require("../auth/obtenerToken");

(async () => {

    try {

        const { semilla } = await obtenerSemilla();

        console.log("SEMILLA:", semilla);

        const xmlFirmado = firmarSemilla(semilla);

        console.log(xmlFirmado);

        const token = await obtenerToken(xmlFirmado);

        console.dir(token, { depth: null });

    } catch (err) {

        console.error(err);

    }

})();