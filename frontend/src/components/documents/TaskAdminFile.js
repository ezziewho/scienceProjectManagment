import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext"; // Fetching user data
import "../../css/TaskDocuments.css";
import { IconDownload, IconTrash, IconEdit } from "@tabler/icons-react";

const TaskAdminFile = () => {
  const [file, setFile] = useState(null);
  const [tasks, setTasks] = useState([]); // List of tasks to select from
  const [selectedTaskId, setSelectedTaskId] = useState(""); // Selected task ID for upload
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTaskForFiles, setSelectedTaskForFiles] = useState(""); // Selected task ID for fetching files
  const [taskFiles, setTaskFiles] = useState([]); // List of files linked to the task

  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch user's tasks
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/kanban/tasks/all"
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !selectedTaskId) {
      setMessage("Please select a file and a task.");
      return;
    }

    if (!currentUser) {
      setMessage("Error: User not logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task_id", selectedTaskId);
    formData.append("user_id", currentUser.id);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:8081/document/upload/task-file",
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
      setSelectedTaskId("");
      setDescription("");
    } catch (error) {
      console.error("File upload error:", error);
      setMessage(
        error.response?.data?.error || "Error uploading file. Please try again."
      );
    }
  };

  const handleGetFiles = async () => {
    if (!selectedTaskForFiles) {
      setMessage("Please select a task to fetch files.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/document/files/task/${selectedTaskForFiles}`
      );
      setTaskFiles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage("Error fetching task files.");
      setTaskFiles([]);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/document/download/task/${fileId}`,
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
        `http://localhost:8081/document/delete/task/${fileId}`
      );
      setTaskFiles(taskFiles.filter((file) => file.id !== fileId));
      setMessage("File has been deleted.");
    } catch (error) {
      console.error("File deletion error:", error);
      setMessage("Error: Unable to delete the file.");
    }
  };

  return (
    <div className="task-documents-container">
      <div className="task-documents-section">
        <h2>Select a task to view files</h2>
        <div className="mb-3">
          <select
            className="form-control"
            value={selectedTaskForFiles}
            onChange={(e) => setSelectedTaskForFiles(e.target.value)}
          >
            <option value="">-- Select a Task --</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-secondary" onClick={handleGetFiles}>
          Get Files
        </button>

        <ul className="list-group mb3">
          {taskFiles.map((file) => (
            <li key={file.id} className="list-group-item">
              <strong>{file.file_name}</strong> <br />
              <div className="file-actions">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleDownloadFile(file.id, file.file_name)}
                >
                  <IconDownload />
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleDownloadFile(file.id, file.file_name)}
                >
                  <IconEdit />
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
      </div>
      <div className="task-documents-section">
        <h2>Upload Task Document</h2>
        {message && (
          <div
            className="alert alert-info"
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
        )}

        <form onSubmit={handleUpload} className="mt-3">
          <div>
            <label className="form-label">Select File</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Select Task</label>
            <select
              className="form-control"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              required
            >
              <option value="">-- Select a Task --</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
          <div>
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

export default TaskAdminFile;
