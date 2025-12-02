// controllers/userController.js
const User = require('../models/User'); // Importa o modelo User

// Função para obter os dados pessoais do usuário
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    
    res.json({
      id: user._id,
      username: user.username,     
      role: user.role,
      documentId: user.documentId, 
      dateOfBirth: user.dateOfBirth,
      phone: user.phone,
      cep: user.cep,
      addressNumber: user.addressNumber,
      addressComplement: user.addressComplement,
      addressStreet: user.addressStreet,
      addressNeighborhood: user.addressNeighborhood,
    });
  } catch (err) {
    console.error('Erro ao buscar dados do usuário:', err.message);
    res.status(500).json({ msg: 'Erro interno do servidor' });
  }
};

module.exports = {
  getUserProfile,
};

// Atualiza os dados do perfil do usuário autenticado
const updateUserProfile = async (req, res) => {
  try {
    // Campos permitidos para atualização (evitar alterações em campos sensíveis)
    const allowedFields = [
      'username',
      'documentId',
      'dateOfBirth',
      'phone',
      'cep',
      'addressNumber',
      'addressComplement',
      'addressStreet',
      'addressNeighborhood',
      'city',
      'state',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ msg: 'Nenhum campo válido para atualizar foi fornecido.' });
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password -otp -otpExpiry');

    if (!updated) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    res.json({
      id: updated._id,
      username: updated.username,
      role: updated.role,
      documentId: updated.documentId,
      dateOfBirth: updated.dateOfBirth,
      phone: updated.phone,
      cep: updated.cep,
      addressNumber: updated.addressNumber,
      addressComplement: updated.addressComplement,
      addressStreet: updated.addressStreet,
      addressNeighborhood: updated.addressNeighborhood,
    });
  } catch (err) {
    console.error('Erro ao atualizar dados do usuário:', err.message);
    res.status(500).json({ msg: 'Erro interno do servidor' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
