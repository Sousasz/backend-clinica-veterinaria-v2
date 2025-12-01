const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Tentando conectar ao MongoDB...');
    console.log('URI:', process.env.MONGO_URI.replace(/:\S+@/, ':<password>@')); // Oculta a senha

    await mongoose.connect(process.env.MONGO_URI); // Removidas opções obsoletas

    console.log('MongoDB conectado com sucesso');
  } catch (error) {
    console.error('Falha na conexão com o MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
