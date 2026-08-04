const leerCAF = require("./utils/leerCAF");


leerCAF("caf-demo.xml")
    .then(console.log)
    .catch(console.error);