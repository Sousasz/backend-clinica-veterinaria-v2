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

connectDB();

const app = express();

// Configura CORS de forma mais robusta — permite origens definidas e responde a preflight
const allowedOrigins = [
  "https://joyce-veterinaria.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions = {
  origin: function (origin, callback) {
    // requests from tools like curl/postman may have no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Origin not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
  credentials: true,
};

// Usar o middleware CORS com as opções e garantir resposta a preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/medicines', medicineRoutes); 
app.use('/api/vaccines', vaccineRoutes); 
app.use('/api/ratings', ratingRoutes); 
app.use('/api/appointments', appointmentRoutes);
app.use('/api/animals', animalRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Servidor rodando no Render!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
