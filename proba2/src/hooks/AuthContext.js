import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:8081/user/checkauth", { withCredentials: true })
            .then((res) => {
                if (res.data.valid) {
                    setCurrentUser({
                        id: res.data.userId,
                        role: res.data.role, // Rola użytkownika (admin/user)
                    });
                } else {
                    setCurrentUser(null);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error checking auth:", err);
                setLoading(false);
            });
    }, []);

    const logout = () => {
        axios
            .post("http://localhost:8081/auth/logout", {}, { withCredentials: true })
            .then(() => {
                setCurrentUser(null); // Usuwamy użytkownika ze stanu
            })
            .catch((err) => console.error("Logout error:", err));
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
