// Home.js
import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to the KEC Contact Manager</h1>
            <p>
                This project allows you to efficiently manage and organize your contacts. You can add, view, and search contacts stored in a MongoDB database.
            </p>
            <h2>Key Features:</h2>
            <ul>
                <li>Add new contacts with detailed information including ID, name, phone number, email, department, designation, address, and date of birth.</li>
                <li>Edit existing contacts to keep your information up-to-date.</li>
                <li>Delete contacts you no longer need with confirmation prompts.</li>
                <li>Search functionality to quickly find contacts based on name, department, or address.</li>
                <li>Attractive and user-friendly interface designed with modern CSS.</li>
            </ul>
            <h2>Get Started:</h2>
            <p>
                To get started, navigate to the Add Contact section to begin managing your contacts. Enjoy!
            </p>
        </div>
    );
};

export default Home;
