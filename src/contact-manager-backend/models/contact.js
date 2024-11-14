// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: String,
    dob: Date,
    department: String,
    designation: String
});

module.exports = mongoose.model('Contact', contactSchema);
