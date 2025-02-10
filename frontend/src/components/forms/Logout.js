import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('http://localhost:8081/logout')
            .then(res => {
                if (res.data.success) {
                    navigate('/login'); // Redirect to login page
                } else {
                    alert("Failed to log out");
                }
            })
            .catch(err => {
                console.error("Logout error:", err);
            });
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            Logout
        </button>
    );
}

export default Logout;
