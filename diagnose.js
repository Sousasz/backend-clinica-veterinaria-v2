#!/usr/bin/env node
// diagnose.js - Script de diagnóstico

console.log('===========================================');
console.log('DIAGNOSTICO DO SERVIDOR');
console.log('===========================================\n');

// 1. Verificar Node.js
console.log('1. Verificar Node.js:');
console.log(`   Versão: ${process.version}\n`);

// 2. Verificar variáveis de ambiente
console.log('2. Variáveis de Ambiente:');
console.log(`   PORT: ${process.env.PORT || 'NÃO CONFIGURADA'}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? 'CONFIGURADA' : 'NÃO CONFIGURADA'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'CONFIGURADA' : 'NÃO CONFIGURADA'}\n`);

// 3. Verificar dependências
console.log('3. Verificar Dependências:');
try {
  require('express');
  console.log('   ✓ express');
} catch (e) {
  console.log('   ✗ express - NÃO INSTALADO');
}

try {
  require('mongoose');
  console.log('   ✓ mongoose');
} catch (e) {
  console.log('   ✗ mongoose - NÃO INSTALADO');
}

try {
  require('cors');
  console.log('   ✓ cors');
} catch (e) {
  console.log('   ✗ cors - NÃO INSTALADO');
}

try {
  require('dotenv');
  console.log('   ✓ dotenv');
} catch (e) {
  console.log('   ✗ dotenv - NÃO INSTALADO');
}

console.log('\n4. Portas Disponíveis:');
const net = require('net');

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', function(err) {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
    server.once('listening', function() {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

(async () => {
  const portAvailable = await checkPort(5000);
  console.log(`   Porta 5000: ${portAvailable ? 'DISPONÍVEL ✓' : 'EM USO ✗'}\n`);

  console.log('===========================================');
  console.log('RECOMENDACOES:');
  console.log('===========================================');
  if (!process.env.MONGO_URI) {
    console.log('1. Configure MONGO_URI no arquivo .env');
    console.log('   Exemplo: MONGO_URI=mongodb://localhost:27017/veterinaria\n');
  }
  if (!process.env.PORT) {
    console.log('2. Configure PORT no arquivo .env');
    console.log('   Exemplo: PORT=5000\n');
  }
  if (!process.env.JWT_SECRET) {
    console.log('3. Configure JWT_SECRET no arquivo .env');
    console.log('   Exemplo: JWT_SECRET=sua_chave_super_secreta_aqui\n');
  }
  console.log('4. Certifique-se de que MongoDB está rodando');
  console.log('   Windows: mongod\n');
})();
