
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserProfile, updateUserProfile } = require('../controllers/userController'); 
const { getUserConsults } = require('../controllers/consultController')

router.get('/profile', auth, getUserProfile);
router.patch('/profile', auth, updateUserProfile);
router.get('/consults', auth, getUserConsults);

module.exports = router;
