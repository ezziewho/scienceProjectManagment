import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../hooks/AuthContext";
import { fetchUserById } from "../services/userService";
import { fetchTeamInfo, changeProjectPhase } from "../services/teamService";
import { fetchUserLeaves, deleteLeave } from "../services/leaveService";
import EditProfileModal from "../components/modals/EditProfileModal";
import RequestLeaveModal from "../components/modals/RequestLeaveModal";
import { IconCheck } from "@tabler/icons-react";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../services/notificationService"; // ✅ Import obsługi powiadomień
import "../css/Profile.css";

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [position, setPosition] = useState("PI");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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

    const getTeamData = async () => {
      try {
        const team = await fetchTeamInfo();
        setTeamData(team);
        if (team) {
          setPosition(team.position);
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
      }
    };

    const getUserNotifications = async () => {
      if (!currentUser?.id) return;
      try {
        const notifs = await fetchNotifications();
        setNotifications(notifs);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setNotifLoading(false);
      }
    };

    getTeamData();
    getUserData();
    getUserLeaves();
    getUserNotifications();
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

  const handleMarkAsRead = async (notifId) => {
    try {
      await markNotificationAsRead(notifId);
      setNotifications(notifications.filter((notif) => notif.id !== notifId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleChangeProjectPhase = async () => {
    try {
      await changeProjectPhase();
      // Optionally, you can refetch the team data to update the UI
      const updatedTeam = await fetchTeamInfo();
      setTeamData(updatedTeam);
    } catch (error) {
      console.error("Error changing project phase:", error);
    }
  };

  if (loading) {
    return (
      <Container className="profile-background">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="profile-background">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="profile-background">
      <Container className="profile-container">
        {/* Add this line to display "HAJ" */}
        <Card className="team-card">
          <Card.Body>
            <div className="checing-team">
              <h3 className="mb-4">
                Team: <strong>{teamData?.team_name}</strong>
                <p> </p>
                Project phase:{" "}
                <strong>
                  {teamData?.phase === true
                    ? "Project Execution"
                    : "Application Preparation"}{" "}
                </strong>
                <p> </p>
              </h3>
            </div>
            {teamData?.phase === false && (
              <Button
                variant="primary"
                className="btn-profile w-100 mb-2"
                onClick={handleChangeProjectPhase}
              >
                Application Approved
              </Button>
            )}
          </Card.Body>
        </Card>
        <p></p>
        <p></p>
        <div className="profile-grid">
          {/* 🟡 BOX 1: DANE O PROFILU */}
          <Card className="profile-card">
            <Card.Body>
              <h2 className="text-center mb-4">My Profile</h2>
              <p>
                <strong>Name:</strong> {userData?.name}
              </p>
              <p>
                <strong>Email:</strong> {userData?.email}
              </p>
              <p>
                <strong>Role:</strong> {userData?.role}
              </p>
              <p>
                <strong>Position:</strong> {position}
              </p>
              <p>
                <strong>Password:</strong> ●●●●●●●●●
              </p>

              <Button
                variant="primary"
                className="btn-profile w-100 mb-2"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="secondary"
                className="w-100"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </Card.Body>
          </Card>

          {/* 🟢 BOX 2: WNIOSKI URLOPOWE */}
          <Card className="profile-card leave-card">
            <Card.Body className="d-flex flex-column">
              <h2 className="mb-3">My Leave Requests</h2>

              {leaveLoading ? (
                <Spinner animation="border" variant="primary" />
              ) : leaveRequests.length === 0 ? (
                <Alert variant="info">No leave requests found.</Alert>
              ) : (
                <Table className="leave-table" striped bordered hover>
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
                          <span
                            className={`badge ${leave.status.toLowerCase()}`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="actions-column">
                          {leave.status === "pending" && (
                            <Button
                              className="btn-delete"
                              size="sm"
                              onClick={() => handleDeleteLeave(leave.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {/* 🟡 Przycisk na dole karty */}
              <Button
                className="btn-profile btn-profile-primary request-leave-btn mt-3"
                onClick={() => setShowLeaveModal(true)}
              >
                Request Leave
              </Button>
            </Card.Body>
          </Card>

          {/* 🟣 BOX 3: POWIADOMIENIA */}
          <Card className="profile-card leave-card">
            <Card.Body className="d-flex flex-column">
              <h2 className="mb-3">Notifications</h2>

              {notifLoading ? (
                <Spinner animation="border" variant="primary" />
              ) : notifications.length === 0 ? (
                <Alert variant="info">No new notifications.</Alert>
              ) : (
                <Table className="leave-table" striped bordered hover>
                  <thead>
                    <tr>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notif) => (
                      <tr key={notif.id}>
                        <td>{notif.message}</td>
                        <td>{new Date(notif.createdAt).toLocaleString()}</td>
                        <td>
                          <Button
                            className="btn-delete"
                            size="sm"
                            onClick={() => handleMarkAsRead(notif.id)}
                          >
                            <IconCheck size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      </Container>

      {/* Modal edycji profilu */}
      {showEditModal && (
        <EditProfileModal
          userData={userData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveUserData}
        />
      )}
      {/* Modal zgłoszenia urlopu */}
      {showLeaveModal && (
        <RequestLeaveModal
          onClose={() => setShowLeaveModal(false)}
          onSuccess={(newLeave) => {
            setLeaveRequests([...leaveRequests, newLeave]); // Aktualizacja listy urlopów
          }}
        />
      )}
    </div>
  );
}

export default Profile;
