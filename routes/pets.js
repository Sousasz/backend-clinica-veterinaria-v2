const express = require('express');
const { createPet, getPets, updatePet } = require('../controllers/petController');
const router = express.Router();

router.post('/', createPet);
router.get('/', getPets);
router.patch('/:id', updatePet);

module.exports = router;
