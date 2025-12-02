// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/services");
const chatRoutes = require("./api/chat/index.js");
const petRoutes = require('./routes/pets'); 
const medicineRoutes = require('./routes/medicines'); 
const vaccineRoutes = require('./routes/vaccines'); 
const appointmentRoutes = require('./routes/appointments'); 
const userRoutes = require('./routes/user');
const animalRoutes = require('./routes/animals');

// Debug: log types of imported route handlers to help diagnose path-to-regexp errors
console.log('route types:', {
  auth: typeof authRoutes,
  services: typeof serviceRoutes,
  chat: typeof chatRoutes,
  pets: typeof petRoutes,
  medicines: typeof medicineRoutes,
  vaccines: typeof vaccineRoutes,
  appointments: typeof appointmentRoutes,
  user: typeof userRoutes,
  animals: typeof animalRoutes,
});

connectDB();

console.log('After connectDB');

const app = express();

// Configura CORS de forma mais robusta — permite origens definidas e responde a preflight
const defaultAllowedOrigins = [
  "https://joyce-veterinaria.vercel.app",
  "https://clinica-veterinaria-frontend.vercel.app",
  "https://backend-clinica-veterinaria-v2.onrender.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

// Permitir configuração via variável de ambiente (ex: RENDER_APP_URL ou ALLOWED_ORIGINS)
const envAllowed = (process.env.ALLOWED_ORIGINS || "")
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowed]));

console.log('Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server or tools without origin
    if (!origin) return callback(null, true);
    // Durante desenvolvimento, permitir qualquer origem para facilitar testes locais
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    // Em produção, verificar contra lista de origens permitidas
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization", "Accept"],
  credentials: true,
};

// Usar o middleware CORS com as opções e garantir resposta a preflight

console.log('About to set CORS');
try {
  app.use(cors(corsOptions));
  console.log('CORS set');
} catch (err) {
  console.error('Error when calling app.use(cors):', err && err.stack ? err.stack : err);
  throw err;
}

// Não registrar explicitamente handler OPTIONS com path '*' porque em alguns
// ambientes isso causa um erro no `path-to-regexp` ao compilar o path.
// O middleware `cors` já trata preflight quando aplicado globalmente via `app.use`.
// Se for necessário, podemos reativar com uma implementação segura.
console.log('Skipping app.options(*) to avoid path-to-regexp issue');

console.log('About to set express.json middleware');
app.use(express.json());
console.log('express.json set');

// Montar rotas com proteção para identificar rota problemática
const mount = (path, router) => {
  try {
    console.log(`Mounting route: ${path}`);
    app.use(path, router);
  } catch (err) {
    console.error(`Error mounting ${path}:`, err);
    process.exit(1);
  }
};

console.log('About to mount routers');
mount('/api/chat', chatRoutes);
mount('/api/user', userRoutes);
mount('/api/auth', authRoutes);
mount('/api/services', serviceRoutes);
mount('/api/pets', petRoutes);
mount('/api/medicines', medicineRoutes);
mount('/api/vaccines', vaccineRoutes);
mount('/api/appointments', appointmentRoutes);
mount('/api/animals', animalRoutes);
// cpf route removed (CPF validation feature reverted)
console.log('Finished mounting routers');

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Servidor rodando no Render!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
