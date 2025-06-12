import React, { useEffect, useState } from "react";
import axios from "axios";
import { IconCheck, IconX } from "@tabler/icons-react";
import "../css/AdminLeavePanel.css";

const AdminLeavePanel = () => {
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState({});
  const [filters, setFilters] = useState({
    user: "",
    date: "", // Jedno pole dla daty
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:8081/leave", {
          withCredentials: true,
        });

        setLeaves(response.data);

        // Pobieranie nazw użytkowników
        const userPromises = response.data.map(async (leave) => {
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

      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave.id === id ? { ...leave, status } : leave
        )
      );
    } catch (err) {
      console.error("Failed to update leave status:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredLeaves = leaves.filter((leave) => {
    const searchDate = filters.date ? new Date(filters.date) : null;
    const leaveStart = new Date(leave.start_date);
    const leaveEnd = new Date(leave.end_date);

    return (
      (!filters.user ||
        (users[leave.user_id] &&
          users[leave.user_id]
            .toLowerCase()
            .includes(filters.user.toLowerCase()))) &&
      (!filters.date || (searchDate >= leaveStart && searchDate <= leaveEnd)) &&
      (!filters.status ||
        leave.status.toLowerCase() === filters.status.toLowerCase())
    );
  });

  if (loading)
    return <div className="leave-container">Loading leave requests...</div>;
  if (error) return <div className="leave-container error">{error}</div>;

  return (
    <div className="leave-container">
      <h1 className="leave-title">Leave Management</h1>

      {/* Filtry */}
      <div className="filters">
        <input
          type="text"
          name="user"
          placeholder="Search by User"
          value={filters.user}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="date"
          placeholder="Search by Date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Tabela */}
      <table className="leave-table">
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
          {filteredLeaves.map((leave) => (
            <tr key={leave.id}>
              <td>{users[leave.user_id] || "Loading..."}</td>
              <td>{leave.start_date}</td>
              <td>{leave.end_date}</td>
              <td>
                <span className={`badge ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </span>
              </td>
              <td className="actions-column">
                {leave.status === "pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => updateLeaveStatus(leave.id, "approved")}
                    >
                      <IconCheck size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
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
      </table>
    </div>
  );
};

export default AdminLeavePanel;
