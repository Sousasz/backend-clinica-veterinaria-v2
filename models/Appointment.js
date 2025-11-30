const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  consultType: { type: String, required: true }, // Ex: "Vacinação", "Consulta Clínica"
  description: { type: String, required: true },
  // `scheduledAt` é o campo principal que guarda data+hora do agendamento
  scheduledAt: { type: Date, required: true },
  // Mantemos os campos legados `date` e `hour` para compatibilidade com o front-end
  date: { type: Date },
  hour: { type: String }, // Ex: "10:30"
  // Se integrado ao Google Calendar, armazenamos o eventId aqui
  googleEventId: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
