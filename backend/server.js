const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // Allows us to parse JSON bodies
app.use(cors()); // Enables frontend to talk to backend

// Basic Route (Test)
app.get('/', (req, res) => {
  res.send('NeuroForge API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});