const mongoose = require('mongoose');

const ContadorSchema = new mongoose.Schema({

  nombre: {
    type: String,
    unique: true
  },

  valor: {
    type: Number,
    default: 0
  }

});

module.exports = mongoose.model('Contador', ContadorSchema);