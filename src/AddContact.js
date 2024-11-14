import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './AddContact.css';

const AddContact = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        dob: '',
        category: '',
        designation: '',
        department: '',
        rollNumber: '', // Student specific
        linkedin: '',   // Student specific
        yearOfStudy: '',// Student specific
        course: '',     // Student specific (B.E/B.Tech)
        pgOrUg: '',     // Student specific (PG/UG)
    });

    const MySwal = withReactContent(Swal);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { id, name, phone, email, address, dob, category, designation, department, rollNumber, linkedin, yearOfStudy, course, pgOrUg } = formData;

        // Name should contain only alphabets and spaces
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            MySwal.fire({
                title: 'Invalid Name!',
                text: 'Name should contain only alphabets and spaces.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // ID should be a number
        const idRegex = /^\d+$/;
        if (!idRegex.test(id)) {
            MySwal.fire({
                title: 'Invalid ID!',
                text: 'ID should contain only numbers.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // Phone number should be exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            MySwal.fire({
                title: 'Invalid Phone Number!',
                text: 'Phone number should contain exactly 10 digits.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // Email should be a valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            MySwal.fire({
                title: 'Invalid Email!',
                text: 'Please enter a valid email address.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // Roll Number for Students (should be alphanumeric)
        if (category === 'Student' && !rollNumber) {
            MySwal.fire({
                title: 'Roll Number Missing!',
                text: 'Please provide the roll number for the student.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // LinkedIn Address (optional but should follow a valid URL format)
        const linkedinRegex = /^(https:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
        if (category === 'Student' && linkedin && !linkedinRegex.test(linkedin)) {
            MySwal.fire({
                title: 'Invalid LinkedIn URL!',
                text: 'Please enter a valid LinkedIn URL.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // Year of Study (must be a valid year)
        if (category === 'Student' && !yearOfStudy) {
            MySwal.fire({
                title: 'Year of Study Missing!',
                text: 'Please specify the year of study.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // Course (B.E/B.Tech)
        if (category === 'Student' && !course) {
            MySwal.fire({
                title: 'Course Missing!',
                text: 'Please select the course (B.E/B.Tech).',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // PG or UG status (must be selected for students)
        if (category === 'Student' && !pgOrUg) {
            MySwal.fire({
                title: 'PG/UG Missing!',
                text: 'Please specify if the student is in PG or UG.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // Department should not be empty for relevant categories
        if ((category === 'Teaching' || category === 'Non-Teaching' || category === 'Student') && !department) {
            MySwal.fire({
                title: 'Department Missing!',
                text: 'Please select a department.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        // Other fields should not be empty
        if (!address || !dob || !category || !designation) {
            MySwal.fire({
                title: 'Missing Fields!',
                text: 'Please fill in all the required fields.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }

        return true;
    };

    const checkForDuplicate = async (formData) => {
        try {
            const response = await fetch('http://localhost:5000/api/check-duplicate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.id,
                    phone: formData.phone,
                    email: formData.email,
                }),
            });

            const result = await response.json();
            if (result.duplicate) {
                MySwal.fire({
                    title: 'Duplicate Entry!',
                    text: 'A contact with this ID, phone, or email already exists.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    position: 'center',
                });
                return false; 
            }
            return true;
        } catch (error) {
            console.error('Error:', error);
            MySwal.fire({
                title: 'Error!',
                text: 'An error occurred while checking for duplicates.',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center',
            });
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        const isValid = validateForm();
        if (!isValid) return;

        // Check for duplicates
        const noDuplicate = await checkForDuplicate(formData);
        if (!noDuplicate) return;

        // Format the data (e.g., format date of birth)
        const formattedData = {
            ...formData,
            dob: formData.dob.split('T')[0],
        };

        // Submit the form
        try {
            const response = await fetch('http://localhost:5000/api/add-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (response.ok) {
                MySwal.fire({
                    title: 'Success!',
                    text: 'Contact added successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    position: 'center',
                });

                setFormData({
                    id: '',
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    dob: '',
                    category: '',
                    designation: '',
                    department: '', // Reset department
                    rollNumber: '', 
                    linkedin: '',   
                    yearOfStudy: '', 
                    course: '',     
                    pgOrUg: '',     
                });
            } else {
                MySwal.fire({
                    title: 'Error!',
                    text: 'Error adding contact',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    position: 'center', 
                });
            }
        } catch (error) {
            console.error('Error:', error);
            MySwal.fire({
                title: 'Error!',
                text: 'Error adding contact',
                icon: 'error',
                confirmButtonText: 'OK',
                position: 'center', 
            });
        }
    };

    const getDesignationOptions = () => {
        switch (formData.category) {
            case 'Teaching':
                return [
                    'Professor and Head',
                    'Professor',
                    'Associate Professor',
                    'Adjunct Professor',
                    'Assistant Professor',
                ];
            case 'Non-Teaching':
                return [
                    'Lab Assistant',
                    'Library Staff',
                    'Watchman',
                    'Bus Driver',
                    'Office Assistant',
                ];
            case 'Maintenance':
                return ['Sweeper', 'Gardener', 'Plumber', 'Electrician'];
            case 'Admin':
                return ['Admin Officer', 'Clerk'];
            case 'Student':
                return ['Student'];
            default:
                return [];
        }
    };

    const departmentOptions = [
        'CIVIL',
        'MECHANICAL',
        'MECHATRONICS',
        'AUTOMOBILE',
        'FT',
        'EEE',
        'EIE',
        'ECE',
        'CSE',
        'IT',
        'CSD',
        'AIDS',
        'AIML',
    ];

    const courseOptions = [
        'B.E',
        'B.Tech',
    ];

    const pgOrUgOptions = [
        'PG',
        'UG',
    ];

    return (
        <div>
            <form onSubmit={handleSubmit} className="add-contact">
                <div>
                    <label>ID:</label>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Non-Teaching">Non-Teaching</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Admin">Admin</option>
                        <option value="Student">Student</option>
                    </select>
                </div>
                <div>
                    <label>Designation:</label>
                    <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Designation</option>
                        {getDesignationOptions().map((designation) => (
                            <option key={designation} value={designation}>
                                {designation}
                            </option>
                        ))}
                    </select>
                </div>

                {formData.category === 'Student' && (
                    <>
                        <div>
                            <label>Roll Number:</label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>LinkedIn:</label>
                            <input
                                type="text"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Year of Study:</label>
                            <input
                                type="number"
                                name="yearOfStudy"
                                value={formData.yearOfStudy}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Course:</label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                            >
                                <option value="">Select Course</option>
                                {courseOptions.map((course) => (
                                    <option key={course} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>PG or UG:</label>
                            <select
                                name="pgOrUg"
                                value={formData.pgOrUg}
                                onChange={handleChange}
                            >
                                <option value="">Select PG or UG</option>
                                {pgOrUgOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {(formData.category === 'Teaching' || formData.category === 'Non-Teaching' || formData.category === 'Student') && (
                    <div>
                        <label>Department:</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            {departmentOptions.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button type="submit">Add Contact</button>
            </form>
        </div>
    );
};

export default AddContact;
