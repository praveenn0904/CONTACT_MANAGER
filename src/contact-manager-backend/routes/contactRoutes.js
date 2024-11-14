const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');


// Route to get all contacts
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
});

// Route to add a new contact
router.post('/add-contact', async (req, res) => {
    const { id, name, phone, email, address, dob, department, designation } = req.body;

    try {
        const newContact = new Contact({ id, name, phone, email, address, dob, department, designation });
        await newContact.save();
        res.status(201).json({ message: 'Contact added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding contact', error });
    }
});

// Route to validate phone number in real-time


// Route to update a contact
router.put('/update-contact/:id', async (req, res) => {
    const { name, phone, email, address, dob, department, designation } = req.body;

    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, phone, email, address, dob, department, designation },
            { new: true, runValidators: true } // Ensure the updated document is returned and validators are applied
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error });
    }
});

// Route to delete a contact
router.delete('/delete-contact/:id', async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);

        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
});

// Route to check for duplicate contacts by ID, phone, or email
router.post('/check-duplicate', async (req, res) => {
    const { id, phone, email } = req.body;

    try {
        const exists = await Contact.findOne({
            $or: [{ id }, { phone }, { email }]
        });

        if (exists) {
            return res.status(200).json({ message: 'Duplicate found', duplicate: true });
        } else {
            return res.status(200).json({ message: 'No duplicates', duplicate: false });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error checking duplicates', error });
    }
});

module.exports = router;
