// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";  // Import only signInWithEmailAndPassword for login
import { auth } from './firebase';  // Import Firebase auth
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');  // State to store user email
    const [password, setPassword] = useState('');  // State to store user password
    const [errorMessage, setErrorMessage] = useState('');  // State for error message display
    const [showPassword, setShowPassword] = useState(false);  // State to control password visibility
    const navigate = useNavigate();  // React Router hook to navigate

    // Handle form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior

        try {
            // Login logic using Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;  // Access user object from Firebase

            // On successful login, trigger any post-login logic
            onLoginSuccess();
            navigate('/');  // Navigate to home page or another route on success
        } catch (error) {
            // Handle login error and display error message
            setErrorMessage('Invalid email or password. Please try again.');
            console.error(error);
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='main'>
            <div className="login-container">
                <div className="image-section">
                    <img src="/l.png" alt="Login" />
                </div>
                <div className="login-section">
                    <img src="/b.png" alt="Login" className='ai' />
                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="show-password">
                            <input
                                type="checkbox"
                                id="showPassword"
                                onChange={togglePasswordVisibility}
                            />
                            <label htmlFor="showPassword">Show Password</label>
                        </div>

                        <button type="submit">Login</button>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
