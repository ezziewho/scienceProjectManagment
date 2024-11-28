import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

    // Check authentication status on component mount
    useEffect(() => {
        axios.get('http://localhost:8081/user/checkauth') // Endpoint to verify session
            .then(res => {
                setIsLoggedIn(res.data.valid); // Update login status based on server response
            })
            .catch(err => {
                console.error("Error checking authentication:", err);
                setIsLoggedIn(false); // Assume not logged in if there's an error
            });
    }, []);

    const handleLogout = () => {
        axios.post('http://localhost:8081/auth/logout') // Logout API call
            .then(res => {
                if (res.data.success) {
                    setIsLoggedIn(false); // Update login status
                    navigate('/login');   // Redirect to login page
                } else {
                    alert("Failed to log out");
                }
            })
            .catch(err => {
                console.error("Logout error:", err);
            });
    };
    /*const handleLogout = () => {
        // Clear user session or call logout API
        localStorage.clear(); // Example: Clear localStorage
        navigate('/login');   // Redirect to login page
    };*/

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">MyApp</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                        {isLoggedIn ? ( // Conditionally render "Logout" if logged in
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        ) : ( // Render "Login" if not logged in
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}    

export default Navbar;
