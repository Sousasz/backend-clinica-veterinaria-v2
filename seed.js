const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./models/Medicine');
const Vaccine = require('./models/Vaccine');

dotenv.config();

async function seedDatabase() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB');

    // Limpar dados existentes (opcional - comentar se quiser preservar dados)
    // await Medicine.deleteMany({});
    // await Vaccine.deleteMany({});

    // Verificar se já existem dados
    const medicinesCount = await Medicine.countDocuments();
    const vaccinesCount = await Vaccine.countDocuments();

    if (medicinesCount === 0) {
      console.log('Adicionando medicamentos...');
      const medicines = [
        {
          name: 'Amoxicilina',
          description: 'Antibiótico de amplo espectro',
          type: 'no-injectables-medicines'
        },
        {
          name: 'Dipirona Sódica',
          description: 'Analgésico e antitérmico',
          type: 'no-injectables-medicines'
        },
        {
          name: 'Cefalexina',
          description: 'Antibiótico cefalosporina oral',
          type: 'no-injectables-medicines'
        },
        {
          name: 'Insulina',
          description: 'Hormônio para controle de diabetes',
          type: 'injectables-medicines'
        },
        {
          name: 'Penicilina Benzatina',
          description: 'Antibiótico injetável de longa ação',
          type: 'injectables-medicines'
        },
        {
          name: 'Metronidazol',
          description: 'Medicamento para infecções parasitárias',
          type: 'no-injectables-medicines'
        }
      ];

      await Medicine.insertMany(medicines);
      console.log(`${medicines.length} medicamentos adicionados com sucesso!`);
    } else {
      console.log(`Banco de dados já contém ${medicinesCount} medicamentos. Pulando inserção.`);
    }

    if (vaccinesCount === 0) {
      console.log('Adicionando vacinas...');
      const vaccines = [
        {
          name: 'V10 (Polivalente)',
          description: 'Vacina contra cinomose, parvovirose, hepatite e outras doenças',
          type: 'for-dogs'
        },
        {
          name: 'Raiva',
          description: 'Vacina contra raiva - obrigatória por lei',
          type: 'for-dogs'
        },
        {
          name: 'V8 (Polivalente Felina)',
          description: 'Vacina contra panleucopenia, calicivírus e rinotraqueíte',
          type: 'for-cats'
        },
        {
          name: 'Raiva Felina',
          description: 'Vacina contra raiva para gatos',
          type: 'for-cats'
        },
        {
          name: 'Giardíase',
          description: 'Vacina contra Giardia',
          type: 'for-dogs'
        },
        {
          name: 'Leucemia Felina (FeLV)',
          description: 'Vacina contra leucemia felina',
          type: 'for-cats'
        }
      ];

      await Vaccine.insertMany(vaccines);
      console.log(`${vaccines.length} vacinas adicionadas com sucesso!`);
    } else {
      console.log(`Banco de dados já contém ${vaccinesCount} vacinas. Pulando inserção.`);
    }

    console.log('Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao fazer seed do banco de dados:', error.message);
    process.exit(1);
  }
}

seedDatabase();
