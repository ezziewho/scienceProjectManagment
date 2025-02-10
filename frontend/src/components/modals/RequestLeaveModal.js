import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { requestLeave } from "../../services/leaveService";

function RequestLeaveModal({ onClose, onSuccess }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!startDate || !endDate) {
            setError("Both start and end dates are required.");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Start date cannot be after the end date.");
            return;
        }

        try {
            setLoading(true);
            const newLeave = await requestLeave(startDate, endDate);
            onSuccess(newLeave); // Update the parent component with the new leave request
            onClose(); // Close the modal
        } catch (error) {
            setError("Failed to submit leave request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request Leave</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="success" type="submit" disabled={loading} className="w-100">
                        {loading ? "Submitting..." : "Submit Leave Request"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default RequestLeaveModal;
