import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext"; // Fetching user data
import "../../css/TaskDocuments.css";
import { IconDownload, IconTrash } from "@tabler/icons-react";

const TeamDocuments = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [teamFiles, setTeamFiles] = useState([]); // List of files associated with the user

  const { currentUser } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    if (!currentUser) {
      setMessage("Error: User not logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", currentUser.id);
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
    try {
      const response = await axios.get(
        `http://localhost:8081/document/files/team/${currentUser.id}`
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
        <h2 className="mt-4">View Personal Files</h2>
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
                  <span
                    className={`badge ${
                      file.phase === false
                        ? "bg-primary"
                        : file.phase === "In Progress"
                        ? "bg-info text-dark"
                        : "bg-success"
                    }`}
                  >
                    {file.phase === false
                      ? "Application Phase"
                      : file.phase === true
                      ? "Project Execution"
                      : file.phase || "Unknown Phase"}
                  </span>
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

      {/* Sekcja pobierania plików */}
    </div>
  );
};

export default TeamDocuments;
