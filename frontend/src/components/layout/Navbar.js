import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IconUserCircle, IconBell } from '@tabler/icons-react'; 
import "../../css/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8081/user/checkauth", { withCredentials: true })
            .then((res) => {
                if (res.data.valid) {
                    setCurrentUser(res.data);
                    fetchNotifications(res.data.userId);
                }
            })
            .catch(() => setCurrentUser(null));
    }, []);

    const fetchNotifications = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8081/notifications?userId=${userId}`, {
                withCredentials: true,
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notifId) => {
        try {
            await axios.put(`http://localhost:8081/notifications/${notifId}/read`, {}, { withCredentials: true });
            setNotifications(notifications.filter((notif) => notif.id !== notifId));
            setShowDropdown(false);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleLogout = () => {
        axios.post("http://localhost:8081/auth/logout", {}, { withCredentials: true })
            .then(() => {
                setCurrentUser(null);
                navigate("/login");
            })
            .catch((err) => console.error("Logout error:", err));
    };

    // 🔥 FUNKCJA OBSŁUGUJĄCA PRZEKIEROWANIE DLA NIEZALOGOWANYCH UŻYTKOWNIKÓW
    const handleNavigation = (e, path) => {
        if (!currentUser) {
            e.preventDefault();  // Zatrzymuje domyślną nawigację
            navigate("/not-logged-in");  // Przekierowuje do strony dla niezalogowanych
        } else {
            navigate(path); // Normalna nawigacja jeśli zalogowany
        }
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
                            <button className="nav-link custom-link btn-link" onClick={(e) => handleNavigation(e, "/kanban")}>
                                Tasks
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link custom-link btn-link" onClick={(e) => handleNavigation(e, "/team")}>
                                Team
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link custom-link btn-link" onClick={(e) => handleNavigation(e, "/expense")}>
                                Budget
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link custom-link btn-link" onClick={(e) => handleNavigation(e, "/projectfiles")}>
                                Project Files
                            </button>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {currentUser ? (
                            <>
                                {/* 🔔 Ikona powiadomień */}
                                <li className="nav-item notifications">
                                    <button className="notification-icon" onClick={() => setShowDropdown(!showDropdown)}>
                                        <IconBell size={24} />
                                        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
                                    </button>
                                    {showDropdown && (
                                        <div className="notification-dropdown">
                                            {notifications.length === 0 ? (
                                                <p className="no-notifications">Brak nowych powiadomień</p>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div key={notif.id} className="notification-item" onClick={() => markAsRead(notif.id)}>
                                                        <p>{notif.message}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </li>
                                
                                {/* 🧑 Ikona użytkownika */}
                                <li className="nav-item d-flex align-items-center">
                                    <Link to="/profile" className="d-flex align-items-center">
                                        <IconUserCircle size={24} className="me-2 profile-icon" color="white" />
                                    </Link>
                                    <span className="nav-link custom-link">
                                        Logged in as: {currentUser.role}
                                    </span>
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
