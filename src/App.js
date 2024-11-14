import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import Home from './Home';
import AddContact from './AddContact';
import ViewContact from './ViewContact';
import ContactUs from './ContactUs';
import Login from './Login';
import Footer from './Footer'; // Import Footer
import './App.css'; // External CSS

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial state is false

    const handleLoginSuccess = () => {
        setIsLoggedIn(true); // Set to true on successful login
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out!'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoggedIn(false); // Handle logout
                Swal.fire(
                    'Logged Out!',
                    'You have been logged out successfully.',
                    'success'
                );
            }
        });
    };

    return (
        <Router>
            <div className="app-container">
                {isLoggedIn && (
                    <nav className="navbar">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/add-contact">Add Contact</Link></li>
                            <li><Link to="/view-contact">View Contact</Link></li>
                            <li><Link to="/contact-us">Contact Us</Link></li>
                            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
                        </ul>
                    </nav>
                )}

                <Routes>
                    <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/add-contact" element={isLoggedIn ? <AddContact /> : <Navigate to="/login" />} />
                    <Route path="/view-contact" element={true ? <ViewContact /> : <Navigate to="/login" />} />
                    <Route path="/contact-us" element={isLoggedIn ? <ContactUs /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                </Routes>

                {isLoggedIn && <Footer />} {/* Add the Footer component here */}
            </div>
        </Router>
    );
}

export default App;
