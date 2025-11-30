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
const ratingRoutes = require('./routes/rating'); 
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
  ratings: typeof ratingRoutes,
  appointments: typeof appointmentRoutes,
  user: typeof userRoutes,
  animals: typeof animalRoutes,
});

connectDB();

console.log('After connectDB');

const app = express();

// Configura CORS de forma mais robusta — permite origens definidas e responde a preflight
const allowedOrigins = [
  "https://joyce-veterinaria.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server or tools without origin
    if (!origin) return callback(null, true);
    // During development, permit any origin so local frontends (ports) work without extra config
    if (process.env.NODE_ENV !== 'production') return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
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
mount('/api/ratings', ratingRoutes);
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
