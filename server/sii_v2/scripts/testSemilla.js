const obtenerSemilla = require("../auth/obtenerSemilla");

(async () => {

    try {

        const resultado = await obtenerSemilla();

        console.log(resultado);

    } catch (e) {

        console.error(e);

    }

})();