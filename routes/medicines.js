const express = require('express');
const { createMedicine, getMedicines, updateMedicine, deleteMedicine } = require('../controllers/medicineController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');
const router = express.Router();

// GET is public
router.get('/', getMedicines);

// Protected routes (admin only)
router.post('/', auth, admin, createMedicine);
router.put('/:id', auth, admin, updateMedicine);
router.delete('/:id', auth, admin, deleteMedicine);

module.exports = router;
