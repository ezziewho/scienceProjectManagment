import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { IconCheck, IconX } from "@tabler/icons-react";
import "../css/AdminLeavePanel.css";

const AdminLeavePanel = () => {
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:8081/leave", {
          withCredentials: true,
        });
        const leaveRequests = response.data.filter(
          (leave) => leave.status !== "rejected"
        ); // Filtrujemy od razu
        setLeaves(leaveRequests);

        const userPromises = leaveRequests.map(async (leave) => {
          if (!users[leave.user_id]) {
            const userResponse = await axios.get(
              `http://localhost:8081/user/profile/${leave.user_id}`,
              { withCredentials: true }
            );
            return { id: leave.user_id, name: userResponse.data.name };
          }
          return null;
        });

        const userData = await Promise.all(userPromises);
        const userMap = userData.reduce((acc, user) => {
          if (user) acc[user.id] = user.name;
          return acc;
        }, {});

        setUsers((prevUsers) => ({ ...prevUsers, ...userMap }));
      } catch (err) {
        console.error("Error fetching leave requests:", err);
        setError("Failed to fetch leave requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const updateLeaveStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8081/leave/${id}/status`,
        { status },
        { withCredentials: true }
      );

      // Usuwamy wniosek z listy, jeśli został odrzucony
      if (status === "rejected") {
        setLeaves((prevLeaves) =>
          prevLeaves.filter((leave) => leave.id !== id)
        );
      } else {
        setLeaves((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave.id === id ? { ...leave, status } : leave
          )
        );
      }
    } catch (err) {
      console.error("Failed to update leave status:", err);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="leave-container">
      <h2 className="leave-title">Admin Leave Management</h2>
      <Table striped bordered hover className="leave-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{users[leave.user_id] || "Loading..."}</td>
              <td>{leave.start_date}</td>
              <td>{leave.end_date}</td>
              <td>
                <span className={`status-badge ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </span>
              </td>
              <td className="actions-column">
                {leave.status === "pending" && (
                  <>
                    <button
                      className="icon-btn approve-btn me-2"
                      onClick={() => updateLeaveStatus(leave.id, "approved")}
                    >
                      <IconCheck size={16} />
                    </button>
                    <button
                      className="icon-btn reject-btn"
                      onClick={() => updateLeaveStatus(leave.id, "rejected")}
                    >
                      <IconX size={16} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminLeavePanel;
