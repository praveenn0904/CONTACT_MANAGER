import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf"; 
import './View.css';
import Swal from 'sweetalert2';

const ViewContact = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [editingContactId, setEditingContactId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // For pagination
    const contactsPerPage = 7; // Display 7 rows per page

    useEffect(() => {
        fetchContacts();
    }, []);
    console.log(selectedCategory);
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/contacts');
            const data = await res.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
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
            'Office Assistant',
            'Library Staff',
            'Watchman',
            'Bus Driver'
        ],
        maintenance: [
            'Sweeper',
            'Gardener',
            'Plumber',
            'Electrician'
        ],
        admin: [
            'Admin Officer',
            'Clerk'
        ],
        student:[
            'Student'
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

    const handleEdit = (contact) => {
        setEditingContactId(contact._id);
    };

    const handleUpdate = async (contact) => {
        try {
            const res = await fetch(`http://localhost:5000/api/update-contact/${contact._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact),
            });

            if (res.ok) {
                Swal.fire('Updated!', 'Your contact has been updated.', 'success');
                fetchContacts();
                setEditingContactId(null);
            } else {
                throw new Error('Failed to update contact');
            }
        } catch (error) {
            console.error('Error updating contact:', error);
            Swal.fire('Error!', 'There was an error updating the contact.', 'error');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page after a search
    };

    // Filtered contacts based on the selected designation and search term
    const filteredContacts = contacts?.filter(contact => {
        // Ensure designation is a valid string before comparing
        const matchesDesignation = contact?.designation?.trim() === selectedDesignation;
    
        const matchesSearchTerm = searchTerm
            ? (
                (contact?.name && contact?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (contact?.department && contact?.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (contact?.address && contact?.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (contact?.id && contact?.id.includes(searchTerm))
            )
            : true;
    
        return matchesDesignation && matchesSearchTerm;
    });
    

    // Pagination logic
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    // Function to download contacts as a PDF
    const downloadPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape, 'mm' for millimeters, 'a4' for A4 size
        const margin = 15; // Margin for the PDF
        let y = margin; // Starting Y position for the content
        const headerHeight = 10; // Height of the table header
        const rowHeight = 12; // Increased row height for better spacing
        const headers = ["ID", "Name", "Phone", "Email", "Address"];
        const columnWidths = [25, 55, 40, 80, 65]; // Adjusted column widths for landscape
    
        // Add title
        doc.setFontSize(20);
        doc.text('Kongu Engineering College', 105, y, { align: 'center' });
        y += 10; // Space after title
    
        // Add subtitle
        doc.setFontSize(16);
        doc.text(`Contacts for ${selectedDesignation}`, 105, y, { align: 'center' });
        y += 10; // Space after subtitle
    
        // Draw table header
        doc.setFontSize(12);
        const startX = margin;
        const startY = y;
    
        // Draw header background
        doc.setFillColor(200); // Light gray background for header
        doc.rect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), headerHeight, 'F');
    
        // Draw header text
        headers.forEach((header, index) => {
            doc.text(header, startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, startY + 7); // Center text vertically
        });
    
        // Draw header border
        doc.setDrawColor(0); // Black border
        doc.rect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), headerHeight); // Header border
    
        // Draw vertical lines
        let lineX = startX;
        columnWidths.forEach((width) => {
            lineX += width;
            doc.line(lineX, startY, lineX, startY + headerHeight); // Vertical lines
        });
    
        y += headerHeight; // Move Y position down
    
        // Draw table rows
        currentContacts.forEach(contact => {
            if (y + rowHeight > doc.internal.pageSize.height - margin) {
                doc.addPage(); // Add a new page if we run out of space
                y = margin; // Reset y position for new page
                // Redraw header on new page
                doc.setFillColor(200); // Light gray background for header
                doc.rect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), headerHeight, 'F');
                headers.forEach((header, index) => {
                    doc.text(header, startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, startY + 7);
                });
                doc.setDrawColor(0); // Black border
                doc.rect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), headerHeight);
                lineX = startX;
                columnWidths.forEach((width) => {
                    lineX += width;
                    doc.line(lineX, startY, lineX, startY + headerHeight);
                });
                y += headerHeight; // Move Y position down after header
            }
    
            // Ensure all fields have a fallback value if they're undefined or null
            const rowData = [
                contact.id || 'N/A',                          // Fallback for ID
                contact.name || 'N/A',                        // Fallback for Name
                contact.phone || 'N/A',                       // Fallback for Phone
                contact.email || 'N/A',                       // Fallback for Email
                contact.address || 'N/A',                     // Fallback for Address
            ];
    
            // Add department for teaching or specific designations
            if (selectedCategory === 'teaching' || selectedDesignation === 'Lab Assistant' || selectedDesignation === 'Office Assistant') {
                rowData.push(contact.department || 'N/A');   // Fallback for Department
            }
    
            // Draw row background
            doc.setFillColor((currentContacts.indexOf(contact) % 2 === 0) ? 240 : 255); // Alternate row color
            doc.rect(startX, y, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
    
            // Draw each row, ensuring each data field is converted to string
            rowData.forEach((data, index) => {
                // Handle multi-line text for "Address" (long content)
                if (index === 4) { // Address column (index 4)
                    const lines = doc.splitTextToSize(data.toString(), columnWidths[index] - 10); // Wrap text to fit
                    doc.text(lines, startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, y + 7);
                } else {
                    doc.text(data.toString(), startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, y + 7);
                }
            });
    
            // Draw row border
            doc.setDrawColor(0); // Black border
            doc.rect(startX, y, columnWidths.reduce((a, b) => a + b, 0), rowHeight);
    
            // Draw vertical lines for rows
            lineX = startX;
            columnWidths.forEach((width) => {
                lineX += width;
                doc.line(lineX, y, lineX, y + rowHeight); // Vertical lines for rows
            });
    
            y += rowHeight; // Move Y position down for next row
        });
    
        // Save the PDF
        doc.save(`${selectedDesignation}_contacts.pdf`);
    };
    
    
    

    return (
        <div className="view-contact">
            <div className="container">
                {/* Left Section for Categories */}
                <div className="categories-container">
                    <h3>Categories</h3>
                    <div className="categories">
                        {Object.keys(categories).map((category, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setSelectedDesignation(''); // Reset designation when category changes
                                    setEditingContactId(null);
                                }}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Section for Designation and Contact Table */}
                <div className="contact-details">
                    {selectedCategory && (
                        <>
                            <h3>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Contacts</h3>
                            <div className="designations">
                                {categories[selectedCategory].map((designation, index) => (
                                    <button key={index} onClick={() => {
                                        setSelectedDesignation(designation);
                                        setEditingContactId(null);
                                    }}>
                                        {designation}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {selectedDesignation && (
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by name, department, address, or ID..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    )}

                    {loading ? (
                        <p>Loading contacts...</p>
                    ) : (
                        selectedDesignation ? (
                            <div className="table-container">
                                <h3>Contacts for {selectedDesignation}</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>DOB</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Address</th>
                                            {(selectedCategory === 'teaching' || selectedDesignation === 'Lab Assistant' || selectedDesignation === 'Office Assistant' || selectedDesignation==='Student') && (
                                                <th>Department</th>
                                            )}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentContacts.map(contact => (
                                            <tr key={contact._id}>
                                                <td>{contact.id}</td>
                                                {editingContactId === contact._id ? (
                                                    <>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                defaultValue={contact.name}
                                                                onChange={(e) => contact.name = e.target.value}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                defaultValue={new Date(contact.dob).toISOString().split('T')[0]}
                                                                onChange={(e) => contact.dob = e.target.value}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                defaultValue={contact.phone}
                                                                onChange={(e) => contact.phone = e.target.value}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                defaultValue={contact.email}
                                                                onChange={(e) => contact.email = e.target.value}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                defaultValue={contact.address}
                                                                onChange={(e) => contact.address = e.target.value}
                                                            />
                                                        </td>
                                                        {(selectedCategory === 'teaching' || selectedDesignation === 'Lab Assistant' || selectedDesignation === 'Office Assistant') && (
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    defaultValue={contact.department}
                                                                    onChange={(e) => contact.department = e.target.value}
                                                                />
                                                            </td>
                                                        )}
                                                        <td>
                                                            <button onClick={() => handleUpdate(contact)}>Save</button>
                                                            <button onClick={() => setEditingContactId(null)}>Cancel</button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{contact.name}</td>
                                                        <td>{new Date(contact.dob).toLocaleDateString()}</td>
                                                        <td>{contact.phone}</td>
                                                        <td>{contact.email}</td>
                                                        <td>{contact.address}</td>
                                                        {(selectedCategory === 'teaching' || selectedDesignation === 'Lab Assistant' || selectedDesignation === 'Office Assistant' || selectedDesignation==='Student') && (
                                                            <td>{contact.department}</td>
                                                        )}
                                                        <td className="actions">
                                                            <button className="edit" onClick={() => handleEdit(contact)}>Edit</button>
                                                            <button className="delete" onClick={() => handleDelete(contact._id)}>Delete</button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="pagination">
                                    <div className="pagination-actions">
                                        <button className="pagination" onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                                        <button className="pagination" onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
                                        <button onClick={downloadPDF} className="download-pdf">Download PDF</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className='abcd'>Please select a designation to view the contacts.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewContact;
