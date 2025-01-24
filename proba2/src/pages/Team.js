import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import EditUserModal from "../components/modals/EditUserModal";
import AddUserModal from "../components/modals/AddUserModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import "../css/Team.css";

function Team() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { currentUser } = useAuth();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        if (currentUser) {
            axios
                .get("http://localhost:8081/user/team", { withCredentials: true })
                .then((response) => {
                    setTeamMembers(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to load team members.");
                    setLoading(false);
                });
        } else {
            setLoading(false);
            setTeamMembers([]);
        }
    }, [currentUser]);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleAddUser = (newUser) => {
        setTeamMembers((prevMembers) => [...prevMembers, newUser]);
        setIsAddModalOpen(false);
    };
    

    const confirmDeleteUser = (userId) => {
        axios
            .delete(`http://localhost:8081/user/team/${userId}`, { withCredentials: true })
            .then(() => {
                setTeamMembers((prevMembers) =>
                    prevMembers.filter((member) => member.id !== userId)
                );
                setIsDeleteModalOpen(false);
            })
            .catch((error) => console.error("Error deleting user:", error));
    };

    const handleSaveUser = (updatedUser) => {
        setTeamMembers((prevMembers) =>
            prevMembers.map((member) =>
                member.id === updatedUser.id ? updatedUser : member
            )
        );
        setIsEditModalOpen(false);
    };

    if (loading) {
        return <div className="team-container">Loading team members...</div>;
    }

    if (error) {
        return <div className="team-container">{error}</div>;
    }

    return (
        <div className="team-container">
            <h1 className="team-title">Team Members
            {currentUser?.role === "admin" && (
        <button
            className="btn btn-sm btn-success ms-3"
            onClick={() => setIsAddModalOpen(true)}
        >
            Add User
        </button>
    )}
            </h1>

            <div className="members-list">
                {teamMembers.map((member) => (
                    <div key={member.id} className="member-card">
                        {member.role === "admin" && (
                            <div className="role-badge-box">
                                <span className="role-badge">MANAGER</span>
                            </div>
                        )}
                        <h4>{member.name}</h4>
                        <p>{member.email}</p>
                        {currentUser?.role === "admin" && (
                            <div className="member-actions">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleEdit(member)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(member)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modale */}
            {isEditModalOpen && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveUser}
                />
            )}
            {isDeleteModalOpen && userToDelete && (
                <ConfirmDeleteModal
                    user={userToDelete}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={confirmDeleteUser}
                />
            )}
            {isAddModalOpen && (
    <AddUserModal
        user={{ name: "", email: "", role: "user" }} // Domyślne dane dla nowego użytkownika
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddUser}
    />
)}

        </div>
    );
}

export default Team;
