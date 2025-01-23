import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Navbar.css"; // Import custom CSS file for styling


function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:8081/user/checkauth", { withCredentials: true })
            .then((res) => {
                console.log("Authentication response:", res.data);
                setIsLoggedIn(res.data.valid); // Update login status based on server response
            })
            .catch((err) => {
                console.error("Error checking authentication:", err);
                setIsLoggedIn(false); // Assume not logged in if there's an error
            });
    }, []);

    const handleLogout = () => {
        axios
            .post("http://localhost:8081/auth/logout", {}, { withCredentials: true })
            .then(() => {
                setIsLoggedIn(false); // Update login status
                navigate("/login"); // Redirect to login page
            })
            .catch((err) => console.error("Logout error:", err));
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand custom-brand" to="/">SCIMAN</Link>
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
                            <Link className="nav-link custom-link" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/kanban">Kanban</Link>
                        </li>
                    </ul>
                    {/* Move Login/Logout to the right */}
                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link custom-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link custom-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

/*
function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Fetch authentication status when the component mounts
    useEffect(() => {
        axios
            .get("http://localhost:8081/user/checkauth", { withCredentials: true })
            .then((res) => {
                console.log("Authentication response:", res.data);
                setIsLoggedIn(res.data.valid); // Update login status based on server response
            })
            .catch((err) => {
                console.error("Error checking authentication:", err);
                setIsLoggedIn(false); // Assume not logged in if there's an error
            });
    }, []);

    // Handle logout
    const handleLogout = () => {
        axios
            .post("http://localhost:8081/auth/logout", {}, { withCredentials: true })
            .then(() => {
                setIsLoggedIn(false); // Update login status
                navigate("/login"); // Redirect to login page
            })
            .catch((err) => console.error("Logout error:", err));
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand custom-brand" to="/">SCIMAN</Link>
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
                            <Link className="nav-link custom-link" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/kanban">Kanban</Link>
                        </li>
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link custom-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link custom-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

/*import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Fetch authentication status when the component mounts
    useEffect(() => {
        axios
            .get("http://localhost:8081/user/checkauth", { withCredentials: true })
            .then((res) => {
                console.log("Authentication response:", res.data);
                setIsLoggedIn(res.data.valid); // Update login status based on server response
            })
            .catch((err) => {
                console.error("Error checking authentication:", err);
                setIsLoggedIn(false); // Assume not logged in if there's an error
            });
    }, []);

    // Handle logout
    const handleLogout = () => {
        axios
            .post("http://localhost:8081/auth/logout", {}, { withCredentials: true })
            .then(() => {
                setIsLoggedIn(false); // Update login status
                navigate("/login"); // Redirect to login page
            })
            .catch((err) => console.error("Logout error:", err));
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">SCIMAN</Link>
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
                            <Link className="nav-link" to="/kanban">Kanban</Link>
                        </li>
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        ) : (
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

export default Navbar;*/
