import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); // Zamiast samego `isLoggedIn`

    useEffect(() => {
        axios
            .get("http://localhost:8081/user/checkauth", { withCredentials: true })
            .then((res) => {
                if (res.data.valid) {
                    setCurrentUser(res.data); // Pobierz pełne dane użytkownika
                }
            })
            .catch(() => setCurrentUser(null)); // W przypadku błędu ustaw brak użytkownika
    }, []); // Zawsze sprawdzaj sesję przy załadowaniu Navbar

    const handleLogout = () => {
        axios
            .post("http://localhost:8081/auth/logout", {}, { withCredentials: true })
            .then(() => {
                setCurrentUser(null); // Usuń dane użytkownika
                navigate("/login"); // Przekieruj do logowania
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
                        <li className="nav-item">
                            <Link className="nav-link custom-link" to="/team">Team</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {currentUser ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link custom-link">Logged in as: {currentUser.role}</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link custom-link" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
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
