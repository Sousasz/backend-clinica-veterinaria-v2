const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    especie: { type: String, required: true },
    raca: { type: String },
    castrado: { type: Boolean, default: false }, // Campo "Castrado?"
    sexo: { type: String, enum: ['Macho', 'Fêmea', 'Outro', 'Não Informado'], required: true }, // Campo "Sexo"
    peso: { type: Number }, // Campo "Peso"
    temperamento: { type: String }, // Campo "Temperamento"
    });

module.exports = mongoose.model('Animal', animalSchema);
