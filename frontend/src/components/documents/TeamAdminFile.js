import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/TaskDocuments.css";
import { IconDownload, IconTrash } from "@tabler/icons-react";

const TeamAdminFile = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [teamFiles, setTeamFiles] = useState([]); // Lista plików
  const [users, setUsers] = useState([]); // Lista użytkowników
  const [selectedUser, setSelectedUser] = useState(""); // ID wybranego użytkownika

  // Pobranie listy użytkowników
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8081/user/list"); // API do pobrania listy użytkowników
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    if (!selectedUser) {
      setMessage("Please select a user.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", selectedUser);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:8081/document/upload/team-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(`Success! File uploaded: 
        <a href="${response.data.file.fileUrl}" target="_blank">Click here to view the file</a>`);

      // Reset fields after upload
      setFile(null);
      setDescription("");
    } catch (error) {
      console.error("File upload error:", error);
      setMessage(
        error.response?.data?.error || "Error uploading file. Please try again."
      );
    }
  };

  const handleGetTeam = async () => {
    if (!selectedUser) {
      setMessage("Please select a user.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/document/files/team/${selectedUser}`
      );
      setTeamFiles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage("Error fetching files.");
      setTeamFiles([]);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/document/download/team/${fileId}`,
        { responseType: "blob" }
      );

      // Create a URL to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("File download error:", error);
      setMessage("Error: Unable to download the file.");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(
        `http://localhost:8081/document/delete/team/${fileId}`
      );
      setTeamFiles(teamFiles.filter((file) => file.id !== fileId));
      setMessage("File has been deleted.");
    } catch (error) {
      console.error("File deletion error:", error);
      setMessage("Error: Unable to delete the file.");
    }
  };

  return (
    <div className="task-documents-container">
      <div className="task-documents-section">
        <h2 className="mt-4">View Team Files</h2>

        {/* Suwak do wyboru użytkownika */}
        <label className="form-label">Select User</label>
        <select
          className="form-control"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">--- Select a User ---</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Pobranie plików dla wybranego użytkownika */}
        <button className="btn btn-secondary mt-3" onClick={handleGetTeam}>
          Get Files
        </button>

        {Array.isArray(teamFiles) && teamFiles.length === 0 ? (
          <p>No files available for the selected user.</p>
        ) : (
          <ul className="list-group mt-3">
            {teamFiles.map((file) => (
              <li
                key={file.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{file.file_name}</strong>
                  {file.description && (
                    <p className="mb-0">{file.description}</p>
                  )}
                </span>
                <div className="file-actions">
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleDownloadFile(file.id, file.file_name)}
                  >
                    <IconDownload />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <IconTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sekcja uploadu plików */}
      <div className="task-documents-section">
        <h2>Upload Team Document</h2>
        {message && (
          <div
            className="alert alert-info"
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
        )}

        <form onSubmit={handleUpload} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Select File</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Upload File
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamAdminFile;
