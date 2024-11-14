import React, { useState, useEffect } from 'react';
import './View.css';
import Swal from 'sweetalert2';

const ViewContact = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [editContact, setEditContact] = useState(null);
    const [updatedContact, setUpdatedContact] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/contacts');
            const data = await res.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const categories = {
        teaching: [
            'Professor and Head',
            'Professor',
            'Associate Professor',
            'Adjunct Professor',
            'Assistant Professor'
        ],
        nonTeaching: [
            'Lab Assistant',
            'Library Staff',
            'Sweeper',
            'Watchman',
            'Bus Driver'
        ]
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`http://localhost:5000/api/delete-contact/${id}`, {
                        method: 'DELETE',
                    });
                    setContacts(contacts.filter(contact => contact._id !== id));
                    Swal.fire('Deleted!', 'Your contact has been deleted.', 'success');
                } catch (error) {
                    console.error('Error deleting contact:', error);
                }
            }
        });
    };

    const handleEdit = async (contact) => {
        setEditContact(contact);
        setUpdatedContact(contact);
    };

    const handleUpdate = async () => {
        if (editContact) {
            try {
                const res = await fetch(`http://localhost:5000/api/update-contact/${editContact._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedContact),
                });

                const responseData = await res.json(); // Get the response data

                if (res.ok) {
                    Swal.fire('Updated!', 'Your contact has been updated.', 'success');
                    fetchContacts(); // Refresh the contacts
                    setEditContact(null); // Reset the edit contact state
                } else {
                    console.log(responseData); // Log the response data for debugging
                    Swal.fire('Error!', responseData.message || 'There was an error updating the contact.', 'error');
                }
            } catch (error) {
                console.error('Error updating contact:', error);
                Swal.fire('Error!', 'There was an error updating the contact.', 'error');
            }
        }
    };

    const filterContacts = (designation) => {
        return contacts.filter(contact => contact.designation.trim() === designation);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredContacts = contacts.filter(contact => {
        return (
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.department && contact.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
            contact.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.id.includes(searchTerm)
        );
    });

    return (
        <div className="view-contact">
            <h2>View Contacts</h2>
            <div className="categories">
                <button onClick={() => {
                    setSelectedCategory('teaching');
                    setSelectedDesignation('');
                    setEditContact(null);
                }}>Teaching</button>
                <button onClick={() => {
                    setSelectedCategory('nonTeaching');
                    setSelectedDesignation('');
                    setEditContact(null);
                }}>Non-Teaching</button>
            </div>

            {selectedCategory && (
                <div className="designations">
                    {categories[selectedCategory].map((designation, index) => (
                        <button key={index} onClick={() => {
                            setSelectedDesignation(designation);
                            setEditContact(null);
                        }}>
                            {designation}
                        </button>
                    ))}
                </div>
            )}

            {selectedDesignation && (
                <div className="contact-details">
                    <h3>Contacts for {selectedDesignation}</h3>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by name, department, address, or ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>DOB</th>
                                {selectedCategory === 'teaching' && <th>Department</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map(contact => (
                                <tr key={contact._id}>
                                    <td>{contact.id}</td>
                                    <td>{contact.name}</td>
                                    <td>{contact.phone}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.address}</td>
                                    <td>{new Date(contact.dob).toLocaleDateString()}</td>
                                    {selectedCategory === 'teaching' && <td>{contact.department}</td>}
                                    <td>
                                        <button
                                            onClick={() => handleEdit(contact)}
                                            style={{
                                                backgroundColor: '#4CAF50', // Green background
                                                color: 'white', // White text
                                                border: 'none', // No border
                                                padding: '8px 16px', // Padding for button
                                                cursor: 'pointer', // Pointer cursor on hover
                                                borderRadius: '4px', // Rounded corners
                                                marginRight: '8px' // Space between buttons
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contact._id)}
                                            style={{
                                                backgroundColor: '#f44336', // Red background
                                                color: 'white', // White text
                                                border: 'none', // No border
                                                padding: '8px 16px', // Padding for button
                                                cursor: 'pointer', // Pointer cursor on hover
                                                borderRadius: '4px' // Rounded corners
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editContact && (
                <div className="edit-contact">
                    <h3>Edit Contact</h3>
                    <input 
                        type="text" 
                        value={updatedContact.name} 
                        onChange={(e) => setUpdatedContact({ ...updatedContact, name: e.target.value })} 
                        placeholder="Name" 
                    />
                    <input 
                        type="text" 
                        value={updatedContact.phone} 
                        onChange={(e) => setUpdatedContact({ ...updatedContact, phone: e.target.value })} 
                        placeholder="Phone" 
                    />
                    <input 
                        type="email" 
                        value={updatedContact.email} 
                        onChange={(e) => setUpdatedContact({ ...updatedContact, email: e.target.value })} 
                        placeholder="Email" 
                    />
                    <input 
                        type="text" 
                        value={updatedContact.address} 
                        onChange={(e) => setUpdatedContact({ ...updatedContact, address: e.target.value })} 
                        placeholder="Address" 
                    />
                    <input 
                        type="date" 
                        value={updatedContact.dob?.split('T')[0] || ''} 
                        onChange={(e) => setUpdatedContact({ ...updatedContact, dob: e.target.value })} 
                    />
                    {selectedDesignation === 'Lab Assistant' && (
                        <input 
                            type="text" 
                            value={updatedContact.department} 
                            onChange={(e) => setUpdatedContact({ ...updatedContact, department: e.target.value })} 
                            placeholder="Department" 
                        />
                    )}
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => setEditContact(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ViewContact;
