const express = require('express');
const { createVaccine, getVaccines, updateVaccine, deleteVaccine } = require('../controllers/vaccineController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');
const router = express.Router();

// GET is public
router.get('/', getVaccines);

// Protected routes (admin only)
router.post('/', auth, admin, createVaccine);
router.put('/:id', auth, admin, updateVaccine);
router.delete('/:id', auth, admin, deleteVaccine);

module.exports = router;
