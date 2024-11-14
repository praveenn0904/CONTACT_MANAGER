// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', contactRoutes); // Use the contact routes for everything

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/contactManager')
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
