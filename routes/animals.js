const express = require('express');
const {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
  getAnimalsBySpecies,
  getAnimalsBySex,
} = require('../controllers/animalController.js');

const router = express.Router();

// Rotas de filtro (DEVEM VIR ANTES de /:id)
router.get('/species/:especie', getAnimalsBySpecies);  // GET /animals/species/:especie
router.get('/sex/:sexo', getAnimalsBySex);             // GET /animals/sex/:sexo

// Rotas CRUD básicas
router.post('/', createAnimal);              // POST /animals
router.get('/', getAllAnimals);              // GET /animals
router.get('/:id', getAnimalById);           // GET /animals/:id
router.put('/:id', updateAnimal);            // PUT /animals/:id
router.delete('/:id', deleteAnimal);         // DELETE /animals/:id

module.exports = router;
