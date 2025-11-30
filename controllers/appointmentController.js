const AppointmentService = require('../models/AppointmentService');
const PetService = require('../models/PetService'); // Para buscar o pet
const jwt = require('jsonwebtoken');

const { createEvent } = require('../services/googleCalendarService');

exports.createAppointment = async (req, res) => {
  try {
    // aceitar token tanto em Authorization: Bearer <token> quanto em x-auth-token
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      token = req.headers['x-auth-token'] || req.header('x-auth-token');
    }
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const clientId = decoded.user?.id || decoded.id;

    const { petName, consultType, description, date, hour } = req.body;

    // descrição e horário são obrigatórios para o banco (requisito solicitado)
    if (!description || description.toString().trim().length === 0) {
      return res.status(400).json({ message: 'Descrição é obrigatória para agendamento.' });
    }

    if (!date || !hour) {
      return res.status(400).json({ message: 'Data e hora do agendamento são obrigatórias.' });
    }

    // Encontrar o pet pelo nome e ownerId
    const clientPets = await PetService.getPetsByOwner(clientId);
    const pet = clientPets.find(p => p.name.toLowerCase() === petName.toLowerCase());

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado para este usuário.' });
    }

    // combine date + hour -> scheduledAt
    const scheduledAt = new Date(`${date}T${hour}:00`);
    if (isNaN(scheduledAt.getTime())) {
      return res.status(400).json({ message: 'Data/hora inválida.' });
    }

    const result = await AppointmentService.createAppointment({
      client: clientId,
      pet: pet._id,
      consultType,
      description,
      date,
      hour,
      scheduledAt,
    });

    // se criado com sucesso, tentamos criar evento no Google Calendar (se configurado)
    if (result.success && result.appointment) {
      try {
        const start = new Date(result.appointment.scheduledAt);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hora de duração padrão

        const event = await createEvent({
          summary: `Consulta - ${pet.name}`,
          description: `${consultType} - ${description}`,
          startDateTime: start,
          endDateTime: end,
        });

        if (event && event.id) {
          // atualiza o agendamento com o eventId
          await AppointmentService.updateAppointment(result.appointment._id, { googleEventId: event.id });
          // devolve o link para o cliente
          result.googleEvent = { id: event.id, link: event.htmlLink };
        }
      } catch (err) {
        console.error('Erro integrando com Google Calendar:', err);
        // não falhar a criação do agendamento se o Calendar falhar
      }
    }

    res.status(result.status).json(result);

  } catch (error) {
    console.error('Erro no appointmentController.createAppointment:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao criar agendamento' });
  }
};

exports.getClientAppointments = async (req, res) => {
  try {
    // aceitar token tanto em Authorization: Bearer <token> quanto em x-auth-token
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      token = req.headers['x-auth-token'] || req.header('x-auth-token');
    }
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const clientId = decoded.user?.id || decoded.id;

    const appointments = await AppointmentService.getAppointmentsByClient(clientId);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Erro no appointmentController.getClientAppointments:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao buscar agendamentos do cliente' });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    // Pode adicionar verificação de role para admin aqui
    const appointments = await AppointmentService.getAllAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Erro no appointmentController.getAllAppointments:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar todos os agendamentos' });
  }
};
