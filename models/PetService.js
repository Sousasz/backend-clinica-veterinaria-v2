// FileName: MultipleFiles/PetService.js
const Pet = require('./pet');

class PetService {
  static async createPet(petData) {
    try {
      const newPet = new Pet(petData);
      await newPet.save();
      return { success: true, message: 'Pet cadastrado com sucesso', pet: newPet, status: 201 };
    } catch (error) {
      console.error('Erro no PetService.createPet:', error);
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
        return { success: false, errors: validationErrors, status: 400 };
      }
      return { success: false, message: 'Erro interno do servidor ao cadastrar pet', status: 500 };
    }
  }

  static async getPetsByOwner(ownerId) {
    try {
      return await Pet.find({ owner: ownerId });
    } catch (error) {
      console.error('Erro no PetService.getPetsByOwner:', error);
      throw error;
    }
  }

  static async updatePet(ownerId, petId, updateData) {
    try {
      const pet = await Pet.findById(petId);
      if (!pet) {
        return { success: false, message: 'Pet não encontrado', status: 404 };
      }
      if (String(pet.owner) !== String(ownerId)) {
        return { success: false, message: 'Não autorizado', status: 403 };
      }

      // apply allowed fields only
      const allowed = ['name', 'species', 'breed', 'age', 'neutered', 'sex', 'weight', 'temperament'];
      allowed.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(updateData, field)) {
          pet[field] = updateData[field];
        }
      });

      await pet.save();
      return { success: true, message: 'Pet atualizado com sucesso', pet, status: 200 };
    } catch (error) {
      console.error('Erro no PetService.updatePet:', error);
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
        return { success: false, errors: validationErrors, status: 400 };
      }
      return { success: false, message: 'Erro interno do servidor ao atualizar pet', status: 500 };
    }
  }

  // Adicione métodos para atualizar e deletar pets se necessário
}

module.exports = PetService;
