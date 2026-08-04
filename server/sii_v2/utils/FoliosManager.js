const fs = require("fs");
const path = require("path");
const leerCAF = require("./leerCAF");

class FoliosManager {
    constructor() {
        this.caf = null;
        this.ultimoFolio = null;
    }

    cargarCAF(rutaCAF) {
        this.caf = leerCAF(rutaCAF);

        if (this.ultimoFolio === null) {
            this.ultimoFolio = this.caf.folioInicial - 1;
        }

        return this.caf;
    }

    obtenerSiguienteFolio() {

        // ===== MODO DESARROLLO (SIN CAF) =====
        if (!this.caf) {

            if (this.ultimoFolio === null) {
                this.ultimoFolio = 0;
            }

            this.ultimoFolio++;

            return this.ultimoFolio;
        }

        // ===== MODO PRODUCCIÓN (CON CAF) =====
        if (this.ultimoFolio >= this.caf.folioFinal) {
            throw new Error("CAF agotado.");
        }

        this.ultimoFolio++;

        return this.ultimoFolio;
    }

    obtenerCAF() {
        return this.caf;
    }
}

module.exports = new FoliosManager();