import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function EditProfileModal({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    // Obsługa zmian w formularzu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Wysyłanie zmian do backendu
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put(`http://localhost:8081/user/profile/${user.id}`, formData, { withCredentials: true })
            .then((response) => {
                onSave(response.data); // Zwracamy zaktualizowane dane użytkownika
                onClose(); // Zamykamy modal
            })
            .catch((error) => console.error("Error updating profile:", error));
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EditProfileModal;
