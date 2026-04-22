require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const { seedAdmin } = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedAdmin(); // Seed default admin on startup
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

// CORS setup for Dev + Production
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  process.env.FRONTEND_URL // Netlify production URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', require('./routes/apiRoutes'));

app.get('/', (req, res) => {
  res.send('Student Management System Backend is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is healthy!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
