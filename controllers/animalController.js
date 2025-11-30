const Animal = require('../models/animalModel.js');

// Helper: deriva atributos básicos a partir do nome do pet
const deriveAttributesFromName = (nome) => {
  if (!nome || typeof nome !== 'string') return {};
  const name = nome.toLowerCase().trim();

  // heurísticas simples com fallback
  const dogs = ['rex', 'fido', 'bolt', 'buddy', 'max', 'toto', 'rocky'];
  const cats = ['luna', 'miau', 'whiskers', 'cleo', 'nina', 'kitty', 'garfield'];

  let especie = 'Outro';
  if (dogs.some(d => name.includes(d))) especie = 'Cachorro';
  else if (cats.some(c => name.includes(c))) especie = 'Gato';

  // raça padrão por espécie
  let raca = 'SRD';
  if (especie === 'Cachorro') raca = 'SRD';
  if (especie === 'Gato') raca = 'SRD';

  // castrado heurística (nomes contendo 'castrado' ou 'castrada')
  const castrado = /castrad(o|a)/i.test(name) ? true : false;

  // sexo heurística simples: nomes terminados em 'a' tendem a ser fêmeas (apenas heurística)
  let sexo = 'Não Informado';
  if (/[aá]$/.test(name)) sexo = 'Fêmea';
  else if (/[oó]$/.test(name) || /rex|max|buddy|rocky|bolt|fido/.test(name)) sexo = 'Macho';

  // peso estimado por espécie
  let peso = null;
  if (especie === 'Cachorro') peso = 12; // valor médio
  else if (especie === 'Gato') peso = 4;

  // temperamento por nome (heurística divertida)
  let temperamento = 'Calmo';
  if (/rex|bolt|rocky|max/.test(name)) temperamento = 'Alerta';
  if (/miau|kitty|luna/.test(name)) temperamento = 'Carinhoso';

  return { especie, raca, castrado, sexo, peso, temperamento };
};

// Criar um novo animal
const createAnimal = async (req, res) => {
  try {
    // req.user deve ser preenchido pelo middleware de autenticação
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const { nome } = req.body;

    // Nome é obrigatório; os demais campos podem ser derivados a partir do nome
    if (!nome) {
      return res.status(400).json({ message: 'Nome do animal é obrigatório.' });
    }

    // Deriva atributos a partir do nome quando campos não são enviados
    const derived = deriveAttributesFromName(nome);
    const especie = req.body.especie || derived.especie;
    const raca = req.body.raca || derived.raca;
    const castrado = typeof req.body.castrado === 'boolean' ? req.body.castrado : derived.castrado || false;
    const sexo = req.body.sexo || derived.sexo || 'Não Informado';
    const peso = typeof req.body.peso === 'number' ? req.body.peso : derived.peso || null;
    const temperamento = req.body.temperamento || derived.temperamento || null;

    const newAnimal = new Animal({
      owner: userId,
      nome,
      especie,
      raca,
      castrado,
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
    const { nome } = req.body;

    // Se o nome for informado e outros campos faltarem, derivamos os valores
    const derived = nome ? deriveAttributesFromName(nome) : {};
    const especie = req.body.especie || derived.especie;
    const raca = req.body.raca || derived.raca;
    const castrado = typeof req.body.castrado === 'boolean' ? req.body.castrado : derived.castrado || false;
    const sexo = req.body.sexo || derived.sexo || 'Não Informado';
    const peso = typeof req.body.peso === 'number' ? req.body.peso : derived.peso || null;
    const temperamento = req.body.temperamento || derived.temperamento || null;

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    // Verifica propriedade do animal
    const foundAnimal = await Animal.findById(id);
    if (!foundAnimal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }
    if (foundAnimal.owner && foundAnimal.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este animal.' });
    }

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

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    // Verifica propriedade do animal
    const foundAnimal = await Animal.findById(id);
    if (!foundAnimal) {
      return res.status(404).json({ 
        message: 'Animal não encontrado' 
      });
    }
    if (foundAnimal.owner && foundAnimal.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este animal.' });
    }

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
