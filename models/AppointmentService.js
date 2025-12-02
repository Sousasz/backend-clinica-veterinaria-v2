const Appointment = require('./Appointment');

class AppointmentService {
  static async createAppointment(appointmentData) {
    try {
      const newAppointment = new Appointment(appointmentData);
      await newAppointment.save();
      return { success: true, message: 'Agendamento criado com sucesso', appointment: newAppointment, status: 201 };
    } catch (error) {
      console.error('Erro no AppointmentService.createAppointment:', error);
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
        return { success: false, errors: validationErrors, status: 400 };
      }
      return { success: false, message: 'Erro interno do servidor ao criar agendamento', status: 500 };
    }
  }

  static async getAppointmentsByClient(clientId) {
    try {
      return await Appointment.find({ client: clientId }).populate('pet', 'name species');
    } catch (error) {
      console.error('Erro no AppointmentService.getAppointmentsByClient:', error);
      throw error;
    }
  }

  static async getAllAppointments() {
    try {
      return await Appointment.find().populate('client', 'username addressStreet addressNumber addressNeighborhood').populate('pet', 'name species');
    } catch (error) {
      console.error('Erro no AppointmentService.getAllAppointments:', error);
      throw error;
    }
  }

  static async isSlotTaken(scheduledAt) {
    try {
      // exact match on scheduledAt (Date)
      const exists = await Appointment.findOne({ scheduledAt: scheduledAt });
      return Boolean(exists);
    } catch (error) {
      console.error('Erro no AppointmentService.isSlotTaken:', error);
      throw error;
    }
  }

  // Adicione métodos para atualizar e deletar agendamentos se necessário

  static async updateAppointment(id, updateData) {
    try {
      const updated = await Appointment.findByIdAndUpdate(id, updateData, { new: true });
      return { success: true, appointment: updated, status: 200 };
    } catch (error) {
      console.error('Erro no AppointmentService.updateAppointment:', error);
      return { success: false, message: 'Erro interno ao atualizar agendamento', status: 500 };
    }
  }

  static async deleteAppointment(id) {
    try {
      const appt = await Appointment.findById(id);
      if (!appt) return { success: false, message: 'Agendamento não encontrado', status: 404 };

      await Appointment.findByIdAndDelete(id);
      return { success: true, message: 'Agendamento deletado com sucesso', status: 200 };
    } catch (error) {
      console.error('Erro no AppointmentService.deleteAppointment:', error);
      return { success: false, message: 'Erro interno ao deletar agendamento', status: 500 };
    }
  }
}

module.exports = AppointmentService;
