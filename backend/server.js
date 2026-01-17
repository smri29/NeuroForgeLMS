const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Mount Route files
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

// Load env vars
dotenv.config();

// Connect to Database
connectDB(); 

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('NeuroForge API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});