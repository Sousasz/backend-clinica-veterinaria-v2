const express = require('express');
const { createAppointment, getClientAppointments, getAllAppointments, deleteAppointment } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/', createAppointment);
router.get('/client', getClientAppointments); // Agendamentos do cliente logado
// Protegemos a rota /all com autenticação e checagem de admin
router.get('/all', auth, adminMiddleware, getAllAppointments); // Todos os agendamentos (para admin)
router.delete('/:id', auth, adminMiddleware, deleteAppointment);

module.exports = router;

