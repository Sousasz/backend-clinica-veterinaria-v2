const Animal = require('../models/animalModel.js');

// Criar um novo animal
const createAnimal = async (req, res) => {
  try {
    const { nome, especie, raca, castrado, sexo, peso, temperamento } = req.body;

    // Validação básica
    if (!nome || !especie || !sexo) {
      return res.status(400).json({ 
        message: 'Nome, espécie e sexo são obrigatórios.' 
      });
    }

    const newAnimal = new Animal({
      nome,
      especie,
      raca,
      castrado: castrado || false,
      sexo,
      peso,
      temperamento,
    });

    const savedAnimal = await newAnimal.save();
    res.status(201).json({ 
      message: 'Animal criado com sucesso', 
      animal: savedAnimal 
    });
  } catch (error) {
    console.error('Erro ao criar animal:', error);
    res.status(500).json({ 
      message: 'Erro ao criar animal', 
      error: error.message 
    });
  }
};

// Obter todos os animais
const getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar animais', 
      error: error.message 
    });
  }
};

// Obter um animal por ID
const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ 
        message: 'Animal não encontrado' 
      });
    }

    res.status(200).json(animal);
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar animal', 
      error: error.message 
    });
  }
};

// Atualizar um animal
const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, especie, raca, castrado, sexo, peso, temperamento } = req.body;

    const animal = await Animal.findByIdAndUpdate(
      id,
      { nome, especie, raca, castrado, sexo, peso, temperamento },
      { new: true, runValidators: true }
    );

    if (!animal) {
      return res.status(404).json({ 
        message: 'Animal não encontrado' 
      });
    }

    res.status(200).json({ 
      message: 'Animal atualizado com sucesso', 
      animal 
    });
  } catch (error) {
    console.error('Erro ao atualizar animal:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar animal', 
      error: error.message 
    });
  }
};

// Deletar um animal
const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await Animal.findByIdAndDelete(id);
    if (!animal) {
      return res.status(404).json({ 
        message: 'Animal não encontrado' 
      });
    }

    res.status(200).json({ 
      message: 'Animal deletado com sucesso', 
      animal 
    });
  } catch (error) {
    console.error('Erro ao deletar animal:', error);
    res.status(500).json({ 
      message: 'Erro ao deletar animal', 
      error: error.message 
    });
  }
};

// Obter animais por espécie
const getAnimalsBySpecies = async (req, res) => {
  try {
    const { especie } = req.params;

    const animals = await Animal.find({ especie });
    res.status(200).json(animals);
  } catch (error) {
    console.error('Erro ao buscar animais por espécie:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar animais por espécie', 
      error: error.message 
    });
  }
};

// Obter animais por sexo
const getAnimalsBySex = async (req, res) => {
  try {
    const { sexo } = req.params;

    const animals = await Animal.find({ sexo });
    res.status(200).json(animals);
  } catch (error) {
    console.error('Erro ao buscar animais por sexo:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar animais por sexo', 
      error: error.message 
    });
  }
};

module.exports = {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
  getAnimalsBySpecies,
  getAnimalsBySex,
};
