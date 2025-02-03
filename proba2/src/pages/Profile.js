import React, { useState, useEffect } from "react";
import { Container, Card, Button, Table, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../hooks/AuthContext";
import { fetchUserById } from "../services/userService";
import { fetchUserLeaves, deleteLeave } from "../services/leaveService";
import EditProfileModal from "../components/modals/EditProfileModal";
import RequestLeaveModal from "../components/modals/RequestLeaveModal";
import "../css/Profile.css"; // Styling

function Profile() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [leaveLoading, setLeaveLoading] = useState(true);

    useEffect(() => {
        const getUserData = async () => {
            if (!currentUser?.id) return;
            try {
                const data = await fetchUserById(currentUser.id);
                setUserData(data);
            } catch (err) {
                setError("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        const getUserLeaves = async () => {
            if (!currentUser?.id) return;
            try {
                const leaves = await fetchUserLeaves();
                setLeaveRequests(leaves);
            } catch (err) {
                console.error("Error fetching leave requests:", err);
            } finally {
                setLeaveLoading(false);
            }
        };

        getUserData();
        getUserLeaves();
    }, [currentUser?.id]);

    const handleSaveUserData = (updatedUser) => {
        setUserData(updatedUser);
    };

    const handleDeleteLeave = async (leaveId) => {
        try {
            await deleteLeave(leaveId);
            setLeaveRequests(leaveRequests.filter((leave) => leave.id !== leaveId));
        } catch (error) {
            console.error("Error deleting leave request:", error);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100 profile-background">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100 profile-background">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <div className="profile-background">
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card className="p-4 shadow-sm profile-card w-100">
                    <Card.Body>
                        <h2 className="text-center mb-4">My Profile</h2>

                        <p><strong>Name:</strong> {userData?.name}</p>
                        <p><strong>Email:</strong> {userData?.email}</p>
                        <p><strong>Role:</strong> {userData?.role}</p>
                        <p><strong>Password:</strong> ●●●●●●</p>

                        <Button
                            variant="primary"
                            className="w-100 mb-2"
                            onClick={() => setShowEditModal(true)}
                        >
                            Edit My Data
                        </Button>

                        <Button
                            variant="secondary"
                            className="w-100 mb-4"
                            onClick={() => setShowPasswordModal(true)}
                        >
                            Change Password
                        </Button>

                        {/* LEAVE REQUESTS SECTION */}
                        <h3 className="mt-4">My Leave Requests</h3>

                        <Button
                            variant="success"
                            className="mb-3"
                            onClick={() => setShowLeaveModal(true)}
                        >
                            + Request Leave
                        </Button>

                        {leaveLoading ? (
                            <Spinner animation="border" variant="primary" />
                        ) : leaveRequests.length === 0 ? (
                            <Alert variant="info">No leave requests found.</Alert>
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveRequests.map((leave) => (
                                        <tr key={leave.id}>
                                            <td>{leave.start_date}</td>
                                            <td>{leave.end_date}</td>
                                            <td>
                                                <span className={`badge ${
                                                    leave.status === "approved" ? "bg-success" :
                                                    leave.status === "rejected" ? "bg-danger" :
                                                    "bg-warning text-dark"
                                                }`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td>
                                                {leave.status === "pending" && (
                                                    <>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteLeave(leave.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Edit Profile Modal */}
            {showEditModal && userData && (
                <EditProfileModal
                    user={userData}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveUserData}
                />
            )}

            {/* Request Leave Modal */}
            {showLeaveModal && (
                <RequestLeaveModal
                    onClose={() => setShowLeaveModal(false)}
                    onSuccess={(newLeave) => setLeaveRequests([...leaveRequests, newLeave])}
                />
            )}
        </div>
    );
}

export default Profile;
